import crypto from "crypto";

const algorithm = "aes-256-cbc";
const YUP_API = process.env.YUP_API;

const decrypt = (encryptedData) => {
  const key = Buffer.from(YUP_API, "hex");
  const iv = Buffer.from(encryptedData.iv, "hex");
  const encryptedText = Buffer.from(encryptedData.encryptedData, "hex");

  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const transformData = async (data, type) => {
  try {
    let decryptedData;
    if (type === "gifs") {
      const decryptedDataString = decrypt(data);
      decryptedData = JSON.parse(decryptedDataString);
    } else {
      decryptedData = data; // For PNGs, use the data as is
    }

    const nextValue = decryptedData.next;

    return {
      nextValue,
      result: decryptedData.results.map((item) => ({
        title: item.content_description || item.title || "",
        uri:
          type === "gifs"
            ? item.media_formats?.gif?.url || item.url || ""
            : item,
      })),
    };
  } catch (error) {
    console.error("Error in transformData:", error);
    throw new Error("Failed to decrypt or transform data");
  }
};
