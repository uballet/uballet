import express from "express";
import QuotesService from "../services/quotes";

const router = express.Router();

router.get("/", async (req, res) => {
  const coin = req.query.coin as string;

  // Split coin by comma
  const coins = coin.split(",");

  // Define response object, which will be sent as JSON key string value number
  let response: { [key: string]: number } = {};
  for (const coin of coins) {
    let quote = await QuotesService.getQuote(coin);
    response[coin] = quote;
  }

  console.log("Response", response);

  if (!response) {
    return res.status(400).json({ error: "Invalid coin" });
  }

  return res.send(response);
});

export default router;
