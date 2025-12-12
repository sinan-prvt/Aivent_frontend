import api from "../../../core/api/axios";
import { AUTH } from "../../../core/constants/api-routes";

export const enableMFA = () => api.get(AUTH.ENABLE_MFA);
export const confirmEnableMFA = (secret, code) =>
  api.post(AUTH.CONFIRM_MFA, { secret, code });
export const disableMFA = () => api.post(AUTH.DISABLE_MFA);

export const verifyMFA = (session_id, code) =>
  api.post(AUTH.VERIFY_MFA, { session_id, code });
