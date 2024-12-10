const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URL;

async function deleteAllPosts() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db("instagram-clone");
    const posts = database.collection("posts");

    // Delete all documents in the posts collection
    const result = await posts.deleteMany({});
    console.log(`${result.deletedCount} posts were deleted.`);
  } catch (err) {
    console.error("An error occurred while deleting posts:", err);
  } finally {
    await client.close();
  }
}

deleteAllPosts();
