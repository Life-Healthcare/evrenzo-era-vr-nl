import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAppState from "@/hooks/use-app-state";

export default function ResetAppOnExit() {
  const { isPresenting } = useAppState();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isPresenting) return;
    if (pathname === "/") return;
    navigate("/");
  }, [pathname, isPresenting]);

  return <></>;
}
