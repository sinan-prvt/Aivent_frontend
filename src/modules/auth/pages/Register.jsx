import { useState } from "react";
import { registerUser } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    let newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    await new Promise((r) => window.grecaptcha.ready(r));

    const token = await window.grecaptcha.execute(
      "6LdwKQ8sAAAAAE6NapNtdAu20LFs3HRs9iFd6ACx",
      { action: "register" }
    );

    await registerUser({
      ...formData,
      recaptcha_token: token,
    });

    navigate(
  `/otp-verify?email=${encodeURIComponent(formData.email)}&purpose=email_verify`,
  { replace: true }
);
  } catch (err) {
    console.error("REGISTER ERROR:", err?.response?.data);
    alert(JSON.stringify(err?.response?.data || err?.message, null, 2));
  }
};



  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[430px]">

        <div className="hidden lg:flex w-1/2 bg-blue-600 text-white 
                        items-center justify-center p-8 rounded-r-full">

          <div className="text-center max-w-xs">
            <h1 className="text-3xl font-bold mb-3">Join Us!</h1>
            <p className="text-sm">Create your account to get started.</p>
          </div>

        </div>

        <div className="w-1/2 p-8 flex flex-col justify-center">

          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mb-5 text-sm">Fill your details below.</p>

          <form onSubmit={handleSubmit} className="space-y-3">

            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-xl border-gray-300
                focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-xl border-gray-300
                focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-xl border-gray-300
                focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-xl border-gray-300
                focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold 
              hover:bg-blue-700 transition text-sm"
            >
              Continue
            </button>

          </form>

          <div className="mt-6">
            <p className="text-center text-gray-500 text-xs mb-3">Or sign up with</p>

            <div className="flex justify-center gap-3">
              <button
  className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100"
  onClick={() => {
    const clientId = "368057036266-6guernmjcbua4siag0kfgjpht9i7l9bi.apps.googleusercontent.com";
    const redirectUri = "http://localhost:5173/auth/google/callback";

    const url =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&access_type=offline` +
      `&prompt=select_account` +
      `&scope=openid%20email%20profile`;

    window.location.href = url;
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 48 48"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 12.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.17 24.55c0-1.57-.14-3.08-.39-4.55H24v9.02h12.69c-.55 2.97-2.24 5.49-4.76 7.18l7.31 5.69C43.68 37.41 46.17 31.41 46.17 24.55z"
    />
    <path
      fill="#FBBC05"
      d="M10.54 28.44C9.96 26.87 9.64 25.17 9.64 23.39c0-1.78.32-3.48.9-5.05l-7.98-6.19C.99 15.54 0 19.65 0 23.99c0 4.34.99 8.45 2.56 12.01l7.98-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 47.98c6.48 0 11.93-2.14 15.91-5.81l-7.31-5.69c-2.03 1.37-4.62 2.17-8.6 2.17-6.26 0-11.57-3.22-14.46-8.09l-7.98 6.19C6.51 42.6 14.62 47.98 24 47.98z"
    />
  </svg>
</button>

      
<button
  className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100"
  onClick={() => {
    const clientId = "1d6f3723-9d92-41b2-81af-44dc76c477af";
    const redirectUri = "http://localhost:5173/auth/microsoft/callback";
    const scope = encodeURIComponent("openid profile email");

    const url =
      `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` +
      `?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_mode=query` +
      `&scope=${scope}` +
      `&state=ms_auth`;

    window.location.href = url;
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
    <rect width="10" height="10" x="1" y="1" fill="#F25022"/>
    <rect width="10" height="10" x="12" y="1" fill="#7FBA00"/>
    <rect width="10" height="10" x="1" y="12" fill="#00A4EF"/>
    <rect width="10" height="10" x="12" y="12" fill="#FFB900"/>
  </svg>
</button>


            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
