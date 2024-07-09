const corsOptions = {
  origin: 'http://localhost:5173', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow sending cookies and credentials
  optionsSuccessStatus: 200 // Some legacy browsers (IE11) choke on 204
};

module.exports = corsOptions;