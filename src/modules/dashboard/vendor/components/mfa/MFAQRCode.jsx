export default function MFAQRCode({ src }) {
  if (!src) return null;
  return (
    <>
      <p>Scan this QR using Google Authenticator</p>
      <img src={src} alt="MFA QR" />
    </>
  );
}
