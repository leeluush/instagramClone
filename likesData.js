const { MongoClient } = require("mongodb");
const { faker } = require('@faker-js/faker');

// MongoDB Atlas URI
const uri = "mongodb+srv://leeluush:joey05051986@instagram-clone.5ycbkgz.mongodb.net/?retryWrites=true&w=majority";

/**
 * Generates a random date between two dates.
 * @param {Date} start The start date.
 * @param {Date} end The end date.
 * @return {Date} A random date between the start and end dates.
 */
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function createLikesForComment(commentId, userIds, likeCount) {
  // Generate an array of likes, each with a unique user (if possible)
  const likes = [];
  for (let i = 0; i < likeCount; i++) {
    const userIndex = i % userIds.length; // Cycle through user IDs if more likes than users
    likes.push({
      user: userIds[userIndex]._id,
      comment: commentId,
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
    });
  }
  return likes;
}

async function seedLikes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db("instagram-clone");
    const comments = database.collection("comments");
    const likes = database.collection("likes");
    const users = database.collection("users");

    // Fetch user IDs
    const userIds = await users.find().project({ _id: 1 }).toArray();

    // Fetch all comments
    const commentsCursor = await comments.find();
    await commentsCursor.forEach(async (comment) => {
      // For each comment, create likes based on its `likes` count
      const commentLikes = await createLikesForComment(comment._id, userIds, comment.likes);
      
      // Insert likes into the collection if there are any to insert
      if (commentLikes.length > 0) {
        await likes.insertMany(commentLikes);
      }
    });

    console.log("Likes database seeded!");

  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
}

seedLikes();
