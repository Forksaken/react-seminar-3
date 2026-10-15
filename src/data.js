export const products = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  price: 100 + (i % 50) * 10,
  inStock: i % 3 !== 0,
}));
