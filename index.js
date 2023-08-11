const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

const getHash = (timestamp) => {
  const input = timestamp + privateKey + publicKey;
  const crypto = require("crypto");
  return crypto.createHash("md5").update(input).digest("hex");
};

app.get("/api/marvel/comics", async (req, res) => {
  const MARVEL_API = "https://api.marvel.com/v1/public/comics";
  try {
    const timestamp = Date.now().toString();
    const hash = getHash(timestamp);
    const url = `${MARVEL_API}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
    const response = await axios.get(url);

    const jsonData = response.data.data;
    console.log("Sending response:", jsonData);
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Marvel data" });
  }
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome Home" });
});

app.all("*", (req, res) => {
  return res.status(404).json("Aucune route n'a été trouvée");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
