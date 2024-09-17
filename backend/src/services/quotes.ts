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

  let coinsSplit = coin.split(",");

  let coinsId = "";
  for (coin of coinsSplit) {
    if (!criptoIds[coin]) {
      console.warn("Invalid coin");
    } else {
      coinsId += criptoIds[coin] + ",";
    }
  }
  // Remove last comma
  coinsId = coinsId.slice(0, -1);

  // Passed all validations, let's fetch the data from coinmarketcap API
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${coinsId}&convert=USD`;

  console.log("Fetching data from:", url, "for coins:", coinsSplit);

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

  console.log("Response data obtained from Coin Market Cap API:", data);

  const quotes: {
    [key: string]: {
      quote: number;
      max_supply: number;
      circulating_supply: number;
      total_supply: number;
      volume_24h: number;
      percent_change_24h: number;
      market_cap: number;
      market_cap_dominance: number;
    };
  } = {};
  for (let id of coinsId.split(",")) {
    const symbol = Object.keys(criptoIds).find(
      (key) => criptoIds[key] === id
    ) as string;
    quotes[symbol] = {
      quote: data.data[id].quote.USD.price,
      max_supply: data.data[id].max_supply,
      circulating_supply: data.data[id].circulating_supply,
      total_supply: data.data[id].total_supply,
      volume_24h: data.data[id].quote.USD.volume_24h,
      percent_change_24h: data.data[id].quote.USD.percent_change_24h,
      market_cap: data.data[id].quote.USD.market_cap,
      market_cap_dominance: data.data[id].quote.USD.market_cap_dominance,
    };
  }

  return quotes;
}

export default {
  getQuote,
};
