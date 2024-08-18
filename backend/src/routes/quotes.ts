import express from "express";

const router = express.Router();

const productionReady = false;

const criptoIds: { [key: string]: string } = {
  ETH: "1027",
  BTC: "1",
  BNB: "1839",
  ADA: "2010",
  DOT: "6636",
  UNI: "7083",
  LTC: "2",
  LINK: "1975",
  XLM: "512",
  DOGE: "74",
  BCH: "1831",
  USDT: "825",
  XRP: "52",
  USDC: "3408",
  DAI: "4943",
};

const isStableCoin = (coin: string) => {
  return coin === "DAI" || coin === "USDC" || coin === "USDT";
};

const headers = {
  Accepts: "application/json",
  "X-CMC_PRO_API_KEY": "b6d57d00-f3d3-4a64-ab6b-0d85b1340c84",
};

router.get("/", async (req, res) => {
  const coin = req.query.coin as string;

  // To avoid making requests to the API and get out of credits, we can return a fixed value
  if (!productionReady) {
    if (coin === "ETH") {
      res.send({ coin: 2500 });
    } else {
      res.send({ coin: 1 });
    }
    return;
  }

  // Keep avoiding requests to the API for stable coins
  if (isStableCoin(coin)) {
    res.send({ coin: 1 });
    return;
  }

  // Not a valid coin to fetch
  if (!criptoIds[coin]) {
    res.status(400).send({ error: "Invalid coin" });
    return;
  }

  // Passed all validations, let's fetch the data from coinmarketcap API
  const id = criptoIds[coin];
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}&convert=USD`;

  console.log("Fetching data from", url, "for coin", coin);

  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  const data = await response.json();
  console.log("Data fetched:", data);

  if (!response.ok) {
    res.status(500).send({ error: "Failed to fetch data. Try again!" });
    return;
  }

  res.send({ coin: await data.data[id].quote.USD.price });
});

export default router;
