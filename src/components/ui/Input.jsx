export default function Input({
  label,
  type = "text",
  defaultValue,
  onChange,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <input
        type={type}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        {...props}
      />
    </div>
  );
}
