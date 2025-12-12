export default function Button({
  children,
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`px-5 py-2 rounded-lg font-medium bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
