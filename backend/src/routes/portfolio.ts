import express from "express";
import PortfolioService from "../services/portfolio";

const router = express.Router();

router.get("/value", async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  const lastDays = req.query.last_days;

  // If from is provided, to must be provided as well, but not last_days
  // If last_days is provided, from and to must not be provided
  if ((from && !to) || (to && !from) || (lastDays && (from || to))) {
    return res.status(400).json({
      error: "Invalid query parameters",
    });
  }

  let data;

  if (lastDays) {
    const lastDaysNumber = parseInt(lastDays as string);

    data = await PortfolioService.getPortfolioValueLastDays(
      "9999",
      lastDaysNumber
    );
  } else {
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    data = await PortfolioService.getPortfolioValueFromTo(
      "99999",
      fromDate,
      toDate
    );
  }
  return res.status(200).json(data);
});

export default router;
