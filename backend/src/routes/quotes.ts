import express from "express";
import QuotesService from "../services/quotes";

const router = express.Router();

router.get("/", async (req, res) => {
  const coin = req.query.coin as string;

  const quote = await QuotesService.getQuote(coin);

  if (!quote) {
    return res.status(400).json({ error: "Invalid coin" });
  }

  return res.send({ quote });
});

export default router;
