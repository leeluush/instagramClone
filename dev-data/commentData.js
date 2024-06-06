const { MongoClient } = require("mongodb");
const faker = require("faker");

// MongoDB Atlas URI
const uri = process.env.MONGODB_URL;

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function createRandomComment(userId, postId) {
  return {
    author: userId,
    post: postId,
    content: faker.lorem.sentence(),
    likes: faker.datatype.number({ min: 0, max: 100 }),
    created: getRandomDate(new Date(2023, 0, 1), new Date()), // Generate random date between 2020 and now
    updated: new Date(),
  };
}

async function seedComments() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db("instagram-clone");
    const comments = database.collection("comments");
    const users = database.collection("users");
    const posts = database.collection("posts");

    // Fetch user and post IDs
    const userIds = await users.find().project({ _id: 1 }).toArray();
    const postIds = await posts.find().project({ _id: 1 }).toArray();

    // Create comments for some of the posts
    const commentsData = [];
    for (let post of postIds) {
      const numComments = Math.floor(Math.random() * (userIds.length / 2));
      for (let i = 0; i < numComments; i++) {
        const user = userIds[Math.floor(Math.random() * userIds.length)]._id;
        const newComment = await createRandomComment(user, post._id);
        commentsData.push(newComment);
      }
    }

    // Insert comments into the collection
    await comments.insertMany(commentsData);
    console.log("Comments database seeded!");
  } catch (err) {
    console.error("An error occurred while seeding comments:", err);
  } finally {
    await client.close();
  }
}

seedComments();
