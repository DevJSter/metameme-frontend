const express = require("express");
const { getMemeTemplates } = require("../controllers/memeTemplateController");

const router = express.Router();

router.get("/search-meme", getMemeTemplates);

module.exports = router;
