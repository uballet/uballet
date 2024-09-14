import express from "express";
import PortfolioService from "../services/portfolio";
import QuotesService from "../services/quotes";

const router = express.Router();

router.post("/get_value", async (req, res) => {
  const body = req.body;

  for (const key in body) {
    if (typeof body[key] !== "number" && typeof body[key] !== "string") {
      return res.status(400).json({
        error: "Invalid body",
      });
    }
  }

  let total_value = 0;
  for (const key in body) {
    const coin = key;
    const amount = body[key];
    const quote = await QuotesService.getQuote(coin);
    if (quote === null) {
      return res.status(400).json({
        error: "Invalid coin",
      });
    }
    total_value += quote * amount;
  }

  res.status(200).json({ total_value });
});

router.get("/historical_values", async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  const lastDays = req.query.last_days;
  const userId = "99999";

  if ((from && !to) || (to && !from) || (lastDays && (from || to))) {
    return res.status(400).json({
      error: "Invalid query parameters",
    });
  }

  let data;

  if (lastDays) {
    const lastDaysNumber = parseInt(lastDays as string);

    data = await PortfolioService.getPortfolioValueLastDays(
      userId,
      lastDaysNumber
    );
  } else {
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    data = await PortfolioService.getPortfolioValueFromTo(
      userId,
      fromDate,
      toDate
    );
  }
  return res.status(200).json(data);
});

export default router;
