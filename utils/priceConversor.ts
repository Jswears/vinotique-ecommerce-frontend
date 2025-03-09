export const priceConversor = (price: number) => {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  });

  return currency.format(price / 100);
};
