export default function VendorOTPInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter OTP"
      maxLength={6}
      inputMode="numeric"
    />
  );
}
