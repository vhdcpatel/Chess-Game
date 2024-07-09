const app = require('./app');
const http = require('http');
// Not using the Normal Express server.
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
