import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    if (!location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default ScrollToTop;