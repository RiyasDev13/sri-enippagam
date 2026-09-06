import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getProducts().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  if (loading) return <Loader label="Loading products..." />;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><p className="admin-eyebrow">Catalog</p><h2 className="admin-section-title">All products</h2></div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Add Product
        </Link>
      </div>

      <div className="admin-table-wrap"><table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <img src={p.image} alt={p.name} className="admin-table-img" />
              </td>
              <td><strong className="table-primary-text">{p.name}</strong></td>
              <td><span className="category-chip">{p.category}</span></td>
              <td><strong>₹{p.price}</strong></td>
              <td><span className={`availability ${p.available ? "is-available" : "is-unavailable"}`}><i className="bi bi-circle-fill"></i>{p.available ? "Available" : "Unavailable"}</span></td>
              <td className="admin-table-actions">
                <Link className="icon-action" aria-label={`Edit ${p.name}`} to={`/admin/products/${p._id}/edit`}><i className="bi bi-pencil-square"></i></Link>
                <button className="icon-action danger" aria-label={`Delete ${p.name}`} onClick={() => handleDelete(p._id)}><i className="bi bi-trash3"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}
