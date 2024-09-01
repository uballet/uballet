async function getPortfolioValueFromTo(
  userId: string,
  fromDate: Date,
  toDate: Date
) {
  const data = [];
  let currentDate = fromDate;
  while (currentDate <= toDate) {
    const parsedCurrentDate = currentDate.toISOString().split("T")[0];
    data.push({
      date: parsedCurrentDate,
      value: Math.random() * 10000,
    });
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

async function getPortfolioValueLastDays(userId: string, lastDays: number) {
  let to = new Date();
  let from = new Date();
  from.setDate(from.getDate() - lastDays);

  return getPortfolioValueFromTo(userId, from, to);
}

export default {
  getPortfolioValueFromTo,
  getPortfolioValueLastDays,
};
