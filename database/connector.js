const mongoose = require('mongoose');

function connect() {
  mongoose.connect(process.env.DATABASE_CONNECTION_URI, {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  }, null);
}

module.exports = {
  connect,
  mongoose,
};
