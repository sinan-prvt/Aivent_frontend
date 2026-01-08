import { Outlet } from "react-router-dom";
import FloatingAIAssistant from "../../modules/user/components/FloatingAIAssistant";

export default function PublicLayout() {
  return (
    <div className="relative">
      <Outlet />
      <FloatingAIAssistant />
    </div>
  );
}