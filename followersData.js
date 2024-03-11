const { MongoClient } = require('mongodb');

const databaseName = 'instagram-clone';
const followersCollectionName = 'followers';
const usersCollectionName = 'users';
const mongoDBUri = "mongodb+srv://leeluush:joey05051986@instagram-clone.5ycbkgz.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(mongoDBUri);

async function updateAllFollowers() {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const followersCollection = database.collection(followersCollectionName);
    const usersCollection = database.collection(usersCollectionName);

    const followersCursor = followersCollection.find({});
    while (await followersCursor.hasNext()) {
      const followerDoc = await followersCursor.next();

      // Update the following array of the user (follower)
      await usersCollection.updateOne(
        { _id: followerDoc.user },
        { $addToSet: { following: followerDoc.followee } }
      );

      // Update the followers array of the user being followed (followee)
      await usersCollection.updateOne(
        { _id: followerDoc.followee },
        { $addToSet: { followers: followerDoc.user } }
      );
    }
  } catch (error) {
    console.error('Error in updateAllFollowers:', error);
  } finally {
    await client.close();
  }
}

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await updateAllFollowers();
    console.log('All followers have been updated.');
  } catch (error) {
    console.error('Error during main execution:', error);
  }
}

main();
