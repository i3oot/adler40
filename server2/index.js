
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const MongoService = require('./mongo.service');
const ServerService = require('./server.service');
const {GameRepository, GameController} = require('./game');
const { request } = require('undici');


const env = dotenv.config();
dotenvExpand.expand(env);
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;




const mongoService = new MongoService(mongoUrl, 'Adler40');
const serverService = new ServerService(mongoService, sessionSecret);
const gameRepository = new GameRepository(mongoService);

serverService.init().then( () => {
  serverService.app.get('/config.json', (req, res) => {
    const config = {
      "clientId": process.env.CLIENT_ID
    };
    res.json(config);
  });
  
  serverService.app.post('/token', async (req, res) => {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const code = req.body.code; 

    const response = await request('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `https://localhost:${port}`,
        scope: 'identify,rpc.activities.write',
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  
    const { access_token } = await response.body.json();

    console.log("Reading user data from discord.")
    const userResponse = await request('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

  
    req.session.token = access_token;
    let user = await userResponse.body.json();
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
    socket.onAny((eventName, ...args) => {
      const gameController = new GameController(gameRepository, user, socket);
      socket.on("disconnect", () => gameController.disconnect());
      gameController.dispatch(eventName, ...args);
    });
    socket.join(room);  
  });
  
}).then(() => {
  serverService.startServer(port).catch((err) => {
    if(err) console.error('Error starting the server:', err); 
  });  
});





