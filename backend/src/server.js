const { Server } = require('socket.io');
const app = require('./app');
const http = require('http');
const { authenticationSocket } = require('./middlewares/socketMiddleware');
const { socketController } = require('./controllers/socketController');

// Not using the Normal Express server for socket.
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use(authenticationSocket);

io.on('connection',socketController);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
