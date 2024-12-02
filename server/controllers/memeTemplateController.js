const cheerio = require("cheerio");
const axios = require("axios");

async function scrapeImgflipi(query, page) {
  try {
    const url = `https://imgflip.com/memesearch?q=${encodeURIComponent(
      query
    )}&page=${page}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const imageLinks = [];
    $(".mt-box img").each((index, element) => {
      const imgSrc = $(element).attr("src");
      if (imgSrc) {
        // Ensure we have the full URL
        const fullImageUrl = new URL(imgSrc, "https://i.imgflip.com").href;
        imageLinks.push(fullImageUrl);
      }
    });

    return imageLinks;
  } catch (error) {
    console.error("Error scraping Imgflip:", error);
    return [];
  }
}

const getMemeTemplates = async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  try {
    const imageLinks = await scrapeImgflipi(query, page);
    res.json({ query, results: imageLinks, page });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getMemeTemplates,
};