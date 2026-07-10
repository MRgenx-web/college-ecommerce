// Entry point: loads env, initializes the DB connection, and starts the server.
const env = require('./src/config/env');
require('./src/database/db'); // establishes connection + applies schema
const app = require('./src/app');

app.listen(env.port, () => {
  console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
});
