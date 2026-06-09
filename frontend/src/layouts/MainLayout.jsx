import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import NavbarAtas from "../components/navbaratas/NavbarAtas";
import Kategori from "../components/kategori/Kategori";
import NavbarBawah from "../components/navbarbawah/NavbarBawah";

const MainLayout = () => {
  const [category, setCategory] = useState({ id: null, name: "Semua" });
  const [search, setSearch] = useState("");

  const handleSetCategory = (cat) => {
    setCategory(cat);
    setSearch(""); // ← reset search saat ganti kategori
  };

  return (
    <>
      <NavbarAtas onSearch={setSearch} searchValue={search} />

      <Kategori active={category.name} setActive={handleSetCategory} />

      <main style={{ marginTop: "100px", paddingBottom: "70px" }}>
        <Outlet context={{ category, search }} />
      </main>

      <NavbarBawah />
    </>
  );
};

export default MainLayout;