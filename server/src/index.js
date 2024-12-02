const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const statsRoutes = require("../routes/statsRoutes");
const gifRoutes = require("../routes/gifRoutes");
const memeRoutes = require("../routes/memeRoutes");
const useragent = require("express-useragent");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(useragent.express());

const limiter = rateLimit({
  windowMs: 7 * 24 * 60 * 60 * 1000,
  max: 3600000,
  handler: (req, res) => {
    res.status(429).json({ message: "Too many requests, try again later." });
  },
});

const stats = {
  totalHits: 0,
  uniqueUsers: new Set(),
  userAgentInfo: {},
};

app.use((req, res, next) => {
  const userIp = req.ip;
  const userAgent = req.useragent.source;

  stats.totalHits += 1;

  stats.uniqueUsers.add(userIp);

  if (!stats.userAgentInfo[userAgent]) {
    stats.userAgentInfo[userAgent] = 1;
  } else {
    stats.userAgentInfo[userAgent] += 1;
  }

  next();
});

app.use("/api", gifRoutes);
app.use("/api", memeRoutes);
app.use("/api/stats", statsRoutes(stats));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
