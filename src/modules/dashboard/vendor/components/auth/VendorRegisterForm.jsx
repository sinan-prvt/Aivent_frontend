export default function VendorRegisterForm({ onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit}>
      <input name="business_name" placeholder="Business Name" required />
      <input name="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone" required />
      <textarea name="address" placeholder="Address" />
      <textarea name="password" placeholder="Password" />

      <button disabled={loading}>
        {loading ? "Submitting..." : "Register"}
      </button>
    </form>
  );
}
