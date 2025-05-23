import ProductCard from "../components/ProductCard";

const products = [
  {
    name: "Nike Zoom Pegasus 38",
    category: "Shoes",
    date: "2024-05-10",
  },
  {
    name: "Sony WH-1000XM5",
    category: "Headphones",
    date: "2024-05-18",
  },
  {
    name: "Apple Watch Series 9",
    category: "Smartwatch",
    date: "2024-05-12",
  },
  {
    name: "Herschel Classic Backpack",
    category: "Bags",
    date: "2024-05-10",
  }
];

const Dashboard = () => (
  <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
    {products.map((product, index) => (
      <ProductCard key={index} product={product} />
    ))}
  </div>
);

export default Dashboard;
