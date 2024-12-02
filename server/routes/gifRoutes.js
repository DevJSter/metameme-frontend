const express = require("express");
const { searchGif } = require("../controllers/gifController");

const router = express.Router();

router.get("/search-gif", searchGif);

module.exports = router;
