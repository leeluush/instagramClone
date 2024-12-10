const { MongoClient } = require("mongodb");

// MongoDB Atlas URI
const uri = process.env.MONGODB_URL;

async function createFollowRelationships(client, userIds) {
  const followData = [];

  for (let user of userIds) {
    // Randomly determine the number of users to follow
    const numToFollow = Math.floor(Math.random() * (userIds.length / 2));
    const followees = new Set();

    // Pick random users to follow
    while (followees.size < numToFollow) {
      const followee = userIds[Math.floor(Math.random() * userIds.length)]._id;
      if (String(followee) !== String(user._id)) {
        followees.add(followee);
      }
    }

    // Create follow relationships
    for (let followee of followees) {
      followData.push({
        user: user._id,
        followee: followee,
        created: new Date(),
      });
    }
  }

  return followData;
}

async function seedFollowers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db("instagram-clone");
    const users = database.collection("users");
    const followers = database.collection("followers");

    // Fetch user IDs
    const userIds = await users.find().project({ _id: 1 }).toArray();

    // Create follow relationships
    const followData = await createFollowRelationships(client, userIds);

    // Insert follow data into the collection
    await followers.insertMany(followData);
    console.log("Followers database seeded!");
  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
}

seedFollowers();
