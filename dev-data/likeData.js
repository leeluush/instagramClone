const { MongoClient } = require("mongodb");

// MongoDB Atlas URI
const uri = process.env.MONGODB_URL;

async function createLikes(client, userIds, postIds) {
  const likeData = [];

  // Iterate over posts to randomly assign likes
  for (let post of postIds) {
    // Randomly determine the number of likes for each post
    const numLikes = Math.floor(Math.random() * userIds.length);

    // Set to track unique user likes per post
    const likedByUsers = new Set();

    while (likedByUsers.size < numLikes) {
      const user = userIds[Math.floor(Math.random() * userIds.length)]._id;
      likedByUsers.add(user);
    }

    // Create like documents
    for (let user of likedByUsers) {
      likeData.push({
        user: user,
        post: post._id,
        createdAt: new Date(),
      });
    }
  }

  return likeData;
}

async function seedLikes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db("instagram-clone");
    const likes = database.collection("likes");
    const users = database.collection("users");
    const posts = database.collection("posts");

    // Fetch user and post IDs
    const userIds = await users.find().project({ _id: 1 }).toArray();
    const postIds = await posts.find().project({ _id: 1 }).toArray();

    // Create like relationships
    const likeData = await createLikes(client, userIds, postIds);

    // Insert likes into the collection
    await likes.insertMany(likeData);
    console.log("Likes database seeded!");
  } catch (err) {
    console.error("An error occurred while seeding likes:", err);
  } finally {
    await client.close();
  }
}

seedLikes();
