const { MongoClient } = require("mongodb");
const faker = require("faker");
const bcrypt = require("bcryptjs");

// MongoDB Atlas URI
const uri =
  "mongodb+srv://leeluush:joey05051986@instagram-clone.5ycbkgz.mongodb.net/?retryWrites=true&w=majority";

async function createRandomUser(client) {
  const hashedPassword = await bcrypt.hash("P@ssw0rd", 12);
  return {
    userName: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    profileImage: `https://i.pravatar.cc/150?u=${faker.datatype.uuid()}`,
    email: faker.internet.email().toLowerCase(),
    password: hashedPassword,
    birthDate: faker.date.past(30, new Date("2002-01-01")),
    followings: faker.datatype.number({ min: 0, max: 1000 }),
    followers: faker.datatype.number({ min: 0, max: 1000 }),
  };
}

async function seedDB() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const database = client.db("instagram-clone");
    const users = database.collection("users");

    // Drop the collection if it exists
    // Check if the collection exists before dropping
    const collections = await database
      .listCollections({ name: "users" })
      .toArray();
    if (collections.length > 0) {
      await users.drop();
    }

    // Create random users
    const userData = [];
    for (let i = 0; i < 100; i++) {
      // Adjust number of users as needed
      userData.push(await createRandomUser(client));
    }

    // Insert data into the collection
    await users.insertMany(userData);
    console.log("Database seeded!");
  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
}

seedDB();
