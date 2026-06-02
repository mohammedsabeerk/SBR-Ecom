import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProducts } from "../api/productApi";

const ProductContext = createContext();

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used within ProductProvider");
  return ctx;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      setProductError(null);
      const data = await getProducts();
      if (!Array.isArray(data)) throw new Error("Invalid products response");
      setProducts(data);
    } catch (err) {
      setProductError("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const getProductById = useCallback((id) =>
    products.find((p) =>
      p.id === id || p._id === id ||
      String(p.id) === String(id) || String(p._id) === String(id)
    ), [products]);

  return (
    <ProductContext.Provider value={{ products, setProducts, loadingProducts, productError, getProductById, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
