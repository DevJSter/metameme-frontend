const axios = require("axios");
const crypto = require("crypto");
const { API_KEY, CLIENT_KEY, ENCRYPTION_KEY } = require("../config/config");

const algorithm = "aes-256-cbc";

const encrypt = (text) => {
  if (typeof text !== "string") {
    console.error("Encryption error: Input is not a string", text);
    throw new Error("Input must be a string");
  }

  const key = Buffer.from(ENCRYPTION_KEY, "hex");

  const iv = crypto.randomBytes(16);

  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

const searchGif = async (req, res) => {
  try {
    const query = req.query.q || "funny";
    const limit = 8;
    const next = req.query.next || "";
    const mediaFilter = "gif";

    const response = await axios.get("https://tenor.googleapis.com/v2/search", {
      params: {
        q: query,
        key: API_KEY,
        client_key: CLIENT_KEY,
        limit: limit,
        media_filter: mediaFilter,
        pos:next
      },
    });

    if (!response.data) {
      throw new Error("No data received from Tenor API");
    }

    const dataString = JSON.stringify(response.data);
    // console.log("Data to encrypt:", dataString);

    const encryptedData = encrypt(dataString);
    res.json(encryptedData);
  } catch (error) {
    console.error("Error in searchGif:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

module.exports = {
  searchGif,
};
