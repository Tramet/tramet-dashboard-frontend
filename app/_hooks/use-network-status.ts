"use client";

import { create } from "zustand";

interface NetworkStatus {
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
}

export const useNetworkStatus = create<NetworkStatus>((set) => {
  const setIsOnline = (isOnline: boolean) => set({ isOnline });

  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Cleanup function to remove event listeners
  return { isOnline: false, setIsOnline };
});
