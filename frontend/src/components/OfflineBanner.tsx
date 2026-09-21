import React, { useState, useEffect } from "react";

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-600 dark:bg-amber-700 text-white text-xs font-semibold py-2 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-2"
    >
      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      <span>
        You are currently offline. Operating in offline cached mode. Previously viewed passports and local technician actions remain available.
      </span>
    </div>
  );
};

export default OfflineBanner;
