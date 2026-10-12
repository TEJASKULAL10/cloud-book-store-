export default function Loading({ text = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="muted" style={{ margin: 0, fontSize: "0.95rem" }}>
        {text}
      </p>
    </div>
  );
}
