import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {  //Skopiowane w calości z biblioteki React router. Scrolluje na górę okna przeglądarki
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);   //Scrolluje na górę okna za każdym razem gdy zmienia się pathname

  return null;
}