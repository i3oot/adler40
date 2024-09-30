"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/sessiondb';
const sessionSecret = process.env.SESSION_SECRET || 'defaultSecretKey';
const sessionMiddleware = (0, express_session_1.default)({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: connect_mongo_1.default.create({
        mongoUrl: mongoUrl,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
});
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use(express_1.default.json());
app.use(sessionMiddleware);
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
app.get('/', (req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self';");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send('<html><head></head><body><h1>Hello from Express and Socket.IO! And me.</h1></body></html>');
});
app.get('/config.json', (req, res) => {
    console.log("Getting config.");
    let config = {
        "clientId": process.env.CLIENT_ID
    };
    res.json(config);
});
app.post('/token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const response = yield fetch('https://discord.com/api/oauth2/token', {
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
    const { access_token } = yield response.json();
    const userResponse = yield fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    const userInfo = yield userResponse.json();
    req.session.user = userInfo;
    res.send({ access_token });
    return;
}));
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
