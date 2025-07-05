import { useState, useEffect } from "react";

function useIsSidebarFullWidth(sidebarOpen: boolean) {
  const [isFull, setIsFull] = useState(false);
  useEffect(() => {
    function check() {
      setIsFull(sidebarOpen && window.innerWidth < 768);
    }

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [sidebarOpen]);
  return isFull;
}

export default useIsSidebarFullWidth;
