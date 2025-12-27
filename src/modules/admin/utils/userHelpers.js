export function deriveUserStatus(user) {
  if (!user.isActive) return "inactive";
  if (!user.emailVerified) return "pending_verification";
  if (user.role === "vendor" && !user.vendorApproved)
    return "awaiting_approval";
  return "active";
}


export function statusLabel(status) {
  switch (status) {
    case "active": return "Active";
    case "pending_verification": return "Pending Verification";
    case "awaiting_approval": return "Awaiting Approval";
    default: return "Inactive";
  }
}
