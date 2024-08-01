const { Server } = require('socket.io');
const app = require('./app');
const http = require('http');
const { socketAuth } = require('./middlewares/socketMiddleware');
const { socketController } = require('./controllers/socketController');

// Not using the Normal Express server for socket.
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.use(socketAuth);

io.on('connection',socketController);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
