const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const connect = require('./utils/db.config');

connect();

const port = process.env.PORT || 4000;

app.listen(port, '0.0.0.0', () =>
  console.log(`app is listening on port: ${port} 👋`),
);
