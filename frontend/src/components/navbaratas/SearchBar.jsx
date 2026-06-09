import React, { useState, useEffect } from "react";
import styles from "./searchbar.module.css";

const SearchBar = ({ onSearch, searchValue }) => {
  const [searchQuery, setSearchQuery] = useState(searchValue ?? "");

  useEffect(() => {
    setSearchQuery(searchValue ?? "");
  }, [searchValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className={styles["search-wrapper"]}>
      <div className={styles["search-inner"]}>
        <input
          type="text"
          className={styles["search-input"]}
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {searchQuery && (
          <button className={styles["clear-btn"]} onClick={handleClear}>
            ✕
          </button>
        )}
        <button className={styles["search-btn"]} onClick={handleSearch}>
          Cari
        </button>
      </div>
    </div>
  );
};

export default SearchBar;