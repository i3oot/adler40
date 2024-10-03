
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const express = require("express");
const MongoService = require('./mongo.service');
const ServerService = require('./server.service');

const GameRepository = require('./gameRepository');


const env = dotenv.config();
dotenvExpand.expand(env);
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;




const app = express();
const mongoService = new MongoService(mongoUrl, 'Adler40');
const serverService = new ServerService(app, mongoService, sessionSecret);
const gameRepository = new GameRepository(mongoService);


serverService.startServer(port).catch((err) => {
  console.error('Error starting the server:', err);
});


app.get('/config.json', (req, res) => {
  const config = {
    "clientId": process.env.CLIENT_ID
  };
  res.json(config);
});

app.post('/token', async (req, res) => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'authorization_code',
      code: req.body.code,
    }),
  });

  const { access_token } = await response.json();
  const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  req.session.token = access_token;
  let user = await userResponse.json();
  req.session.user = JSON.stringify(user);
  req.session.save(() => {
    res.send({ access_token });
    return;
  });
});


serverService.io.on("connection", async (socket) => {
  console.log(`connection established`);

  const req = socket.request;
  const room = socket.handshake.query.room;

  if(!(req.session && req.session.user)) {
    console.log("No session.")
    socket.disconnect();
  } 
  const user = JSON.parse(req.session.user);

  socket.join(room);
  console.log(`user ${user.username} joined room ${room}`);
  try{
    const gameState = await gameRepository.loadGame(room);

    socket.emit("gameState", gameState);
  } catch (error) {
    console.error('Error loading or creating game:', error);
    socket.disconnect();
    return;
  }
});


