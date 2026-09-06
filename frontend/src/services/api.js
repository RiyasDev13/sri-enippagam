import axios from "axios";

// Base URL for the backend API
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL });

export const getAdminProfile = () =>
  api.get("/auth/admin/profile").then((res) => res.data);

export const loginAdmin = (data) =>
  api.post("/auth/admin/login", data).then((res) => res.data);

export const loginCustomer = (data) =>
  api.post("/auth/customer/login", data).then((res) => res.data);

export const registerCustomer = (data) =>
  api.post("/auth/customer/register", data).then((res) => res.data);

// Automatically attach the admin JWT when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");

      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);
// ----- Products -----
export const getProducts = (category) =>
  api
    .get("/products", {
      params: category ? { category } : {},
    })
    .then((res) => res.data);

export const getProduct = (id) =>
  api.get(`/products/${id}`).then((res) => res.data);

export const createProduct = (data) =>
  api.post("/products", data).then((res) => res.data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((res) => res.data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((res) => res.data);

// ----- Payments -----
export const createPaymentOrder = (data) =>
  api
    .post("/payment/create-order", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("customerToken") || ""}`,
      },
    })
    .then((res) => res.data);

export const verifyPayment = (data) =>
  api
    .post("/payment/verify", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("customerToken") || ""}`,
      },
    })
    .then((res) => res.data);

// ----- Orders -----
export const getOrders = (params = {}) =>
  api.get("/orders", { params }).then((res) => res.data);

export const getMyOrders = () =>
  api
    .get("/orders/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("customerToken") || ""}`,
      },
    })
    .then((res) => res.data);

export const getOrder = (id) =>
  api.get(`/orders/${id}`).then((res) => res.data);

export const getCustomerOrder = (id) =>
  api
    .get(`/orders/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("customerToken") || ""}`,
      },
    })
    .then((res) => res.data);

export const createOrder = (data) =>
  api
    .post("/orders", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("customerToken") || ""}`,
      },
    })
    .then((res) => res.data);

export const updateOrderStatus = (id, status) =>
  api
    .patch(`/orders/${id}/status`, { status })
    .then((res) => res.data);

export const updatePaymentStatus = (id, paymentStatus) =>
  api.patch(`/orders/${id}/payment-status`, { paymentStatus }).then((res) => res.data);

export const bulkUpdateOrderStatus = (ids, status) =>
  api.patch("/orders/bulk-status", { ids, status }).then((res) => res.data);

// ----- Contact -----
export const createContact = (data) =>
  api.post("/contact", data).then((res) => res.data);

export const getContacts = () =>
  api.get("/contact").then((res) => res.data);

export const updateContactStatus = (id, status) =>
  api
    .patch(`/contact/${id}/status`, { status })
    .then((res) => res.data);


export default api;