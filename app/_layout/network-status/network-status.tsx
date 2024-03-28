"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, X } from "lucide-react";

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" && navigator.onLine
  );
  const [showMessage, setShowMessage] = useState(
    typeof navigator !== "undefined" && !navigator.onLine
  );
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    if (!navigator.onLine) {
      setMessageContent(
        "Estás desconectado, comprueba tu conexión a internet!"
      );
    }

    const handleOnline = () => {
      setIsOnline(true);
      setMessageContent("¡Conexión restablecida!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setMessageContent(
        "Estás desconectado, comprueba tu conexión a internet!"
      );
      setShowMessage(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <>
      {showMessage && (
        <div className="w-[350px] fixed flex justify-start items-center border font-bold h-20 bottom-10 left-5 bg-sidebar-muted text-sidebar-foreground p-2 rounded-lg z-50 shadow-2xl gap-2">
          {isOnline ? (
            <Wifi color="green" width={50} />
          ) : (
            <WifiOff color="red" width={50} />
          )}
          <p className="flex justify-start items-center">{messageContent}</p>
          <div>
            <X
              onClick={handleCloseMessage}
              className="transition-all hover:bg-input cursor-pointer size-10 p-2 rounded-full"
            />
          </div>
        </div>
      )}
    </>
  );
};
