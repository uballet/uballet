import express from "express";
import QuotesService from "../services/quotes";

const router = express.Router();

router.get("/", async (req, res) => {
  const coin = req.query.coin as string;

  // Define response object, which will be sent as JSON key string value number

  let quotes = await QuotesService.getQuote(coin);

  if (!quotes) {
    return res.status(400).json({ error: "Invalid coin" });
  }

  console.log("Response:", quotes);

  return res.send(quotes);
});

export default router;
