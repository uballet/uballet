import { CMC_API_KEY } from "../env";

async function getQuote(coin: string) {
  let coinsId: { [key: string]: number } = {};
  let coinsSymbols = coin.split(",");

  const defaultIds: { [key: string]: number } = {
    BTC: 1,
    ETH: 1027,
    BNB: 1839,
    USDT: 825,
    USDC: 3408,
    DAI: 4943,
    BUSD: 4687,
    AAVE: 7278,
    ADA: 2010,
    WBTC: 3717,
    LINK: 1975,
    DOT: 6636,
    UNI: 7083,
    LTC: 2,
    BCH: 1831,
    XRP: 52,
    DOGE: 74,
    SOL: 5426,
    MATIC: 3890,
    AVAX: 5805,
    ATOM: 3794,
    FIL: 2280,
    TRX: 1958,
    VET: 3077,
    EOS: 1765,
    XLM: 512,
    XTZ: 2011,
    ALGO: 4030,
    ICP: 8916,
    SHIB: 5994,
    LUNA: 4172,
    THETA: 2416,
    ETC: 1321,
    FTM: 3513,
    XMR: 328,
    NEO: 1376,
    // Add more coins here to reduce the number of API calls
  };

  for (let index in coinsSymbols) {
    let symbol = coinsSymbols[index];
    if (defaultIds[symbol]) {
      console.warn("Using default ID for coin:", symbol);
      coinsId[symbol] = defaultIds[symbol];
      continue;
    }

    let url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${symbol}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
      },
    });

    console.log("Fetching data from:", url);

    if (!response.ok) {
      console.error("Failed to fetch data. Try again!");
      continue;
    }

    let data = await response.json();

    console.log("Data obtained from Coin Market Cap API:", data);

    let dataList = data.data;

    if (dataList.length === 0) {
      console.warn("Invalid coin symbol:", symbol);
      continue;
    }

    let id = dataList[0].id;

    if (!id) {
      console.warn("Invalid coin symbol:", symbol);
      continue;
    }

    coinsId[symbol] = id;
  }

  console.log("Coins ID obtained from Coin Market Cap API:", coinsId);

  if (Object.keys(coinsId).length === 0) {
    console.error("No valid coin symbols provided");
    return {};
  }

  // Get Ids
  let coinsIds = Object.values(coinsId).join(",");

  // Passed all validations, let's fetch the data from coinmarketcap API
  let url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${coinsIds}&convert=USD`;

  console.log("Fetching data from:", url);

  let response = await fetch(url, {
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

  let data = await response.json();

  console.log("Response data obtained from Coin Market Cap API:", data);

  // Obtain logo link from Coin Market Cap API
  url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${coinsIds}`;

  console.log("Fetching data from:", url);

  response = await fetch(url, {
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

  let infoData = await response.json();

  console.log("Response data obtained from Coin Market Cap API:", infoData);

  const quotes: {
    [key: string]: {
      id: number;
      name: string;
      quote: number;
      max_supply: number;
      circulating_supply: number;
      total_supply: number;
      volume_24h: number;
      percent_change_24h: number;
      market_cap: number;
      market_cap_dominance: number;
      logo_url?: string;
      cmc_url?: string;
    };
  } = {};

  for (let symbol in coinsId) {
    const id = coinsId[symbol];
    quotes[symbol] = {
      id: id,
      name: data.data[id].name,
      quote: data.data[id].quote.USD.price,
      max_supply: data.data[id].max_supply,
      circulating_supply: data.data[id].circulating_supply,
      total_supply: data.data[id].total_supply,
      volume_24h: data.data[id].quote.USD.volume_24h,
      percent_change_24h: data.data[id].quote.USD.percent_change_24h,
      market_cap: data.data[id].quote.USD.market_cap,
      market_cap_dominance: data.data[id].quote.USD.market_cap_dominance,
      logo_url: infoData.data[id].logo ?? undefined,
      cmc_url:
        infoData.data[id] && infoData.data[id].slug
          ? `https://coinmarketcap.com/currencies/${infoData.data[id].slug}`
          : undefined,
    };
  }

  return quotes;
}

export default {
  getQuote,
};
