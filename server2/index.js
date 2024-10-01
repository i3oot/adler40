const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const env = dotenv.config();
dotenvExpand.expand(env);

const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET || 'defaultSecretKey';

const app = express();
app.set('trust proxy', 1);

const httpServer = createServer(app);

const sessionMiddleware = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
		mongoUrl: mongoUrl,
		dbName: "Adler40",
		mongoOptions: {
		  appName: "Adler40",
		  tls: true,
		},
	}),
  cookie: {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    partitioned: true,
    maxAge: 30 * 60* 1000, //30min
  }
});

app.use(sessionMiddleware);
app.use(express.json());

const io = new Server(httpServer, { path: '/game' });
io.engine.use(sessionMiddleware);


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
  req.session.user = await userResponse.json();
  req.session.save(() => {
    res.send({ access_token });
    return;
  });
});


io.on("connection", (socket) => {
  console.log(`connection established`);

  const req = socket.request;
  const room = socket.handshake.query.room;

  if(!(req.session && req.session.user)) {
    console.log("No session.")
    socket.disconnect();
  } 

  socket.join(room);
  console.log(`user ${req.session.user.username} joined room ${room}`);
  // do app logic join here an emit thing later io.to(room).emit("")
});


httpServer.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});