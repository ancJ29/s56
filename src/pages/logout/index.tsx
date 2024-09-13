import authStore from "@/common/stores/auth";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    authStore.getState().logout({
      to: "/login",
    });
  }, []);
  return <></>;
}
