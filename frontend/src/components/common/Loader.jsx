export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>{label}</p>
    </div>
  );
}
