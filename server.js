const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const bodyParser = require("body-parser");

require('dotenv').config();
const db = require('./database/db');
const authrouter = require("./routes/auth");
const chatrouter = require("./routes/chat");
const livedb = require("./database/liveServer");
const path = require('path');
const io = require('./util/webSocket');
const io1 = require('./util/WebsocketVideocall');


const server = http.createServer(app);

io.attach(server);
io1.attach(server);


try {
  const corsOptions = {
    origin: '*',//[process.env.APP_URL_PROD,process.env.APP_URL_CLIENTBOOKING,process.env.APP_URL_DEV_CLIENTBOOKING],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (cookies, authorization headers)
    optionsSuccessStatus: 204, // Set the preflight response status to 204
  };
  
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  
  app.use('/assets', express.static(path.join(__dirname, 'assets')));


  app.use('/api',authrouter);
  app.use('/chat',chatrouter);
  app.get('/',async(req,res)=>{
    res.status(200).json({
      message:"welcome Backend project"
    });
  })


  app.use('../backend/assets/SndRcvdAudio', express.static(path.join(__dirname, 'uploads')));


  db.raw('SELECT 1')
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((error) => {
    console.log('Error connecting to the database:', error);
  });

} catch (error) {
  console.log(error);
}






server.listen(8001, () => {
    console.log('SERVER IS RUNNING 8001');
})