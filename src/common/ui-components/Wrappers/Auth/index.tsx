import logger from "@/common/helpers/logger";
import useAuthStore from "@/common/stores/auth";
import { WrapperComponentProps } from "@/common/types";
import { Navigate } from "react-router-dom";

export default function AuthWrapper(props: WrapperComponentProps) {
  const { payload } = useAuthStore();
  if (!payload?.id) {
    logger.trace("Dashboard: not logged in");
    return <Navigate to="/login" />;
  }
  return <>{props.children}</>;
}
