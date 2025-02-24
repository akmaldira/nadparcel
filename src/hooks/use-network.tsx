import React from "react";

export function useNetworkStatus() {
  const [isOnline, setOnline] = React.useState<boolean>(true);

  const updateNetworkStatus = () => {
    setOnline(navigator.onLine);
  };

  React.useEffect(() => {
    window.addEventListener("load", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("load", updateNetworkStatus);
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigator.onLine]);

  return { isOnline };
}
