require('dotenv').config();
const path = require('path');
const express = require('express')
const cors = require('cors')
const connect = require('./utils/db.config');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const {errorHandler} = require('./middleware/errorMiddleware')

const router = require('./index')


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



app.use(router)
app.use(errorHandler)
app.use(express.static(path.join(__dirname, 'build')))
app.use('*', express.static(path.join(__dirname, 'build/index.html')))



const port = process.env.PORT || 4000

app.listen(port, '0.0.0.0',() => console.log('app is listening to port: ' + port))