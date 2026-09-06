import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  createProduct,
  updateProduct,
} from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "sweets",
  image: "",
  available: true,
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const product = await getProduct(id);

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "sweets",
          image: product.image || "",
          available: product.available ?? true,
        });

        setPreview(product.image || "");
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const imagePreview = URL.createObjectURL(file);
    setPreview(imagePreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = new FormData();

      payload.append("name", form.name);
      payload.append("description", form.description || "");
      payload.append("price", String(Number(form.price)));
      payload.append("category", form.category);
      payload.append("available", String(form.available));

      if (imageFile) {
        payload.append("image", imageFile);
      }

      console.log("Submitting product:", {
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        available: form.available,
        image: imageFile?.name || "No new image",
      });

      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/products");
    } catch (err) {
      console.error("Product save failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader label="Loading product..." />;
  }

  return (
    <div className="admin-page">
      <div className="form-intro">
        <p className="admin-eyebrow">
          Catalog / {isEdit ? "Edit" : "New"}
        </p>

        <h2 className="admin-section-title">
          {isEdit ? "Edit product" : "Add new product"}
        </h2>

        <p>
          Keep your product information clear and up to date for customers.
        </p>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#ffe5e5",
            color: "#b00020",
          }}
        >
          {error}
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Product information</h3>

          <div className="form-grid">
            <label>
              Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
              />
            </label>

            <label>
              Price (₹) *
              <input
                type="number"
                name="price"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Category *
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="sweets">Sweets</option>
                <option value="snacks">Snacks</option>
                <option value="chats">Chats</option>
                <option value="namkeens">Namkeens</option>
                <option value="other">Other</option>
              </select>
            </label>

            <div className="form-full">
              <label>
                Product Image
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>

              {preview && (
                <div style={{ marginTop: "15px" }}>
                  <p
                    style={{
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Image Preview
                  </p>

                  <img
                    src={preview}
                    alt="Product preview"
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "15px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}

              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  color: "#777",
                }}
              >
                JPG, JPEG, PNG or WEBP • Maximum 5MB
              </small>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            Available for sale
          </label>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={saving}
          >
            <i className="bi bi-check2"></i>{" "}
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Product"
                : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}