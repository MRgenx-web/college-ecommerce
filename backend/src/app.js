// Express application setup: middleware, routes, and error handling.
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const env = require('./config/env');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

// Health check endpoint to verify the server and DB wiring are up.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/users', require('./routes/user.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
