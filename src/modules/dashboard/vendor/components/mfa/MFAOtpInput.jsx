export default function MFAOtpInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={6}
      placeholder="Enter 6-digit code"
      inputMode="numeric"
    />
  );
}
