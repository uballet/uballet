import express from "express";
import PortfolioService from "../services/portfolio";

const router = express.Router();

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
