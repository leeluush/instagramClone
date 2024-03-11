const mongoose = require('mongoose');

async function testDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect('mongodb+srv://leeluush:joey05051986@instagram-clone.5ycbkgz.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    
    console.log('Running a simple query...');
    const start = Date.now();
    await mongoose.connection.db.admin().ping();
    const end = Date.now();
    
    console.log(`Ping response time: ${end - start} ms`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

testDatabase();
