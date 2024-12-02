const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  API_KEY: process.env.API_KEY,
  CLIENT_KEY: process.env.CLIENT_KEY,
  ENCRYPTION_KEY: process.env.YUP_API,
  PORT: process.env.PORT || 3000,
};
