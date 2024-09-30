import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);


type User = {
    id: string;
    username: string;
    avatar: string;
    [key: string]: any; 
  };

  declare module "express-session" {
    interface SessionData {
      user: User;
    }
  }

dotenv.config();

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/sessiondb';
const sessionSecret = process.env.SESSION_SECRET || 'defaultSecretKey';

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
	  maxAge: 1000 * 60 * 60 * 24, // 1 day
	  secure: false, //TODO read env
	  httpOnly: false, 
	  sameSite: 'lax', // Adjust as needed ('lax', 'strict', 'none')
	},
  });


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

app.get('/config.json', (req, res) => {
    console.log("Getting config.")
	req.session.user = {
		"id": "no",
		"username": "no",
		"avatar": "no"
	}
    let config = {
        "clientId": process.env.CLIENT_ID!
    };
    res.json(config);
});

app.post('/token', async (req, res) => {
    const client_id = process.env.CLIENT_ID!;
    const client_secret = process.env.CLIENT_SECRET!;

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

    req.session.user = await userResponse.json();
	res.send({ access_token });
	return;
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
