require('dotenv').config();
const path = require('path');
const express = require('express')
const cors = require('cors')
const connect = require('./models/db');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const {errorHandler} = require('./middleware/errorMiddleware')

const router = require('./routes/index')


const app = express()

connect();

if(process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true 
  }));
}


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/upload', express.static('upload'));


app.use(router)
app.use(errorHandler)
app.use(express.static(path.join(__dirname, '../client/build')))
app.use('*', express.static(path.join(__dirname, '../client/build/index.html')))



const port = process.env.PORT || 4000

app.listen(port, () => console.log('app is listening to port: ' + port))