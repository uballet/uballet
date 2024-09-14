import { CMC_API_KEY } from "../env";

const isStableCoin = (coin: string) => {
  return coin === "DAI" || coin === "USDC" || coin === "USDT";
};

async function getQuote(coin: string) {
  const productionReady = true;

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
    AAVE: "7278",
    WBTC: "3717",
  };

  if (!productionReady) {
    if (coin === "ETH") {
      return 2500;
    } else if (coin === "ERR") {
      return null;
    } else {
      return 1;
    }
  }

  // Keep avoiding requests to the API for stable coins
  if (isStableCoin(coin)) {
    return 1;
  }

  // Not a valid coin to fetch
  if (!criptoIds[coin]) {
    console.error("Invalid coin");
    return null;
  }

  // Passed all validations, let's fetch the data from coinmarketcap API
  const id = criptoIds[coin];
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}&convert=USD`;

  console.log("Fetching data from", url, "for coin", coin);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accepts: "application/json",
      "X-CMC_PRO_API_KEY": CMC_API_KEY,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch data. Try again!");
    return null;
  }

  const data = await response.json();
  console.log("Data fetched:", data);

  return data.data[id].quote.USD.price;
}

export default {
  getQuote,
};
