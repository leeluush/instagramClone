require('dotenv').config();
const path = require('path');
const express = require('express')
const cors = require('cors')
const connect = require('./models/db');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const router = require('./routes/index')


const app = express()

connect();

app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use('/upload', express.static('upload'));


app.use(router)
app.use(express.static(path.join(__dirname, '../client/build')))
app.use('*', express.static(path.join(__dirname, '../client/build/index.html')))



const port = process.env.PORT || 4000

app.listen(port, () => console.log('app is listening to port: ' + port))