const { MongoClient } = require("mongodb");

// MongoDB Atlas URI
const uri = process.env.MONGODB_URL;

async function deleteAllLikes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db("instagram-clone");
    const comments = database.collection("likes");

    // Delete all documents in the comments collection
    const result = await comments.deleteMany({});
    console.log(`${result.deletedCount} likes were deleted.`);
  } catch (err) {
    console.error("An error occurred while deleting likes:", err);
  } finally {
    await client.close();
  }
}

deleteAllLikes();
