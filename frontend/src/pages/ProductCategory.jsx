import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubBanner from "../components/common/SubBanner.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Loader from "../components/common/Loader.jsx";
import { getProducts } from "../services/api.js";

export default function ProductCategory() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts(category === "all" ? undefined : category)
      .then(setProducts)
      .catch(() => setError("Could not load products. Is the backend server running?"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <>
      <SubBanner title={category === "all" ? "All Products" : category} />
      <section className="section">
        <div className="container">
          {loading && <Loader label="Loading products..." />}
          {error && <p className="error-state">{error}</p>}
          {!loading && !error && <ProductGrid products={products} />}
        </div>
      </section>
    </>
  );
}
