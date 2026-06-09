import React from "react";
import "./productCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckFast, faStore } from "@fortawesome/free-solid-svg-icons";

const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

const ProductCard = ({ product }) => {

  // ========================
  // AMBIL GAMBAR PERTAMA
  // ========================
  const getFirstImage = (image) => {
    if (!image) return null;

    if (Array.isArray(image)) {
      return image[0];
    }

    if (typeof image === "string") {
      try {
        const parsed = JSON.parse(image);
        if (Array.isArray(parsed)) return parsed[0];
        return parsed;
      } catch {
        return image;
      }
    }

    return null;
  };
  
  

  const firstImage = getFirstImage(product.image);

const imageUrl = firstImage
  ? `${BASE_IMAGE}${firstImage}`
  : "/images/no-image.png";

  return (
    <div className="product-card">

      {/* IMAGE */}
      <div className="product-image">
        <img
          src={imageUrl}
          alt={product.name}
        />
      </div>

      {/* CONTENT */}
      <div className="product-content">

        <h3 className="product-title">{product.name}</h3>

        <p className="product-price">
          Rp{product.price?.toLocaleString("id-ID")}
        </p>

        <div className="product-badges">
          {product.cod && (
            <span className="badge-cod">
              <FontAwesomeIcon icon={faTruckFast} /> COD
            </span>
          )}
          {product.user && (
            <span className="badge-seller">
              <FontAwesomeIcon icon={faStore} /> Penjual {product.user.name}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
