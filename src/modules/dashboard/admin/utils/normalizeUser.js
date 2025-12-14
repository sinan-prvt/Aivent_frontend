export function normalizeUser(u) {
  const user = {
    id: u.id,
    email: u.email,
    username: u.username,
    fullName: u.full_name ?? "",
    phone: u.phone ?? "",
    role: u.role, // admin | vendor | customer
    emailVerified: Boolean(u.email_verified),
    vendorApproved: Boolean(u.vendor_approved),
    isActive: Boolean(u.is_active),
    totpEnabled: Boolean(u.totp_enabled),
    dateJoined: u.date_joined,
  };

  return {
    ...user,
    status: deriveUserStatus(user),
  };
}

export function deriveUserStatus(user) {
  if (!user.isActive) return "inactive";
  if (!user.emailVerified) return "pending_verification";
  if (user.role === "vendor" && !user.vendorApproved)
    return "awaiting_approval";
  return "active";
}

export function statusLabel(status) {
  switch (status) {
    case "active":
      return "Active";
    case "pending_verification":
      return "Pending Verification";
    case "awaiting_approval":
      return "Awaiting Approval";
    case "inactive":
    default:
      return "Inactive";
  }
}
