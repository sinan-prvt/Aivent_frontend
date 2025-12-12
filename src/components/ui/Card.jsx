export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
