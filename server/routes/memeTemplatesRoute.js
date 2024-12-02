const express = require("express");

module.exports = (stats) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    const uniqueHits = stats.uniqueUsers.size;
    const totalHits = stats.totalHits;
    const userAgentInfo = stats.userAgentInfo;

    res.json({
      totalHits,
      uniqueHits,
      userAgentInfo,
    });
  });

  return router;
};
