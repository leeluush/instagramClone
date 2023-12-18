const { MongoClient } = require("mongodb");
const faker = require("faker");

// MongoDB Atlas URI
const uri =
  "mongodb+srv://leeluush:joey05051986@instagram-clone.5ycbkgz.mongodb.net/instagram-clone?retryWrites=true&w=majority";

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function createRandomPost(userId) {
  return {
    author: userId,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    media: `https://picsum.photos/seed/${faker.datatype.uuid()}/200/300`,
    mediaType: "image",
    thumbnail: `https://picsum.photos/seed/${faker.datatype.uuid()}/200/300`,
    likes: faker.datatype.number({ min: 0, max: 100 }),
    created: getRandomDate(new Date(2023, 0, 1), new Date()), // Generate a random date between 2020 and now
    // other fields as needed
  };
}

async function seedPosts() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db("instagram-clone");
    const posts = database.collection("posts");
    const users = database.collection("users");

    // Fetch user IDs
    const userIds = await users.find().project({ _id: 1 }).toArray();

    // Create posts for each user
    const postsData = [];
    for (let user of userIds) {
      const newPost = await createRandomPost(user._id);
      postsData.push(newPost);
    }

    // Insert posts into the collection
    await posts.insertMany(postsData);
    console.log("Posts database seeded!");
  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
}

seedPosts();
