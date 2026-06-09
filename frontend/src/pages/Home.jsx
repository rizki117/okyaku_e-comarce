//src/pages/Home.jsx

import React from "react";
import { useOutletContext } from "react-router-dom";
import ProductList from "../components/produkpublik/ProductList";

const Home = () => {
  const context = useOutletContext();
  const category = context?.category ?? { id: null, name: "Semua" };
  const search = context?.search ?? "";

  return <ProductList category={category} search={search} />;
};

export default Home;
