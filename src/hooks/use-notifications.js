import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Api from "@/config/api";
import { useSocket } from "@/context/SocketProvider";

export const useNotifications = ({ role = "user" }) => {
  const [notifications, setNotifications] = useState([]);
  const {
    userData: { _id: userId },
  } = useSelector((state) => state.auth);
  const socket = useSocket();

  useEffect(() => {
    const notificationsApi = new Api("/api/notifications");
    const getNotifications = async () => {
      const response = await notificationsApi.get("", {
        recipientId: userId,
        recipientType: role,
      });
      setNotifications(response?.notifications);
    };

    getNotifications();
  }, [role, userId]);

  useEffect(() => {
    const notificationSound = new Audio("/notification-sound.wav");
    notificationSound.volume = 1;

    let audioUnlocked = false;

    const unlockAudio = () => {
      if (!audioUnlocked) {
        notificationSound
          .play()
          .then(() => {
            notificationSound.pause();
            notificationSound.currentTime = 0;
            audioUnlocked = true;
            window.removeEventListener("click", unlockAudio);
            console.log("Audio unlocked for future notifications.");
          })
          .catch(() => {
            console.log("Unlock failed. User interaction needed.");
          });
      }
    };

    const playSound = () => {
      if (audioUnlocked) {
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((error) => console.log("Sound not played:", error));
      } else {
        console.log("Sound skipped. Audio not yet unlocked.");
      }
    };

    window.addEventListener("click", unlockAudio);

    if (socket) {
      socket.on("new-notification", (notification) => {
        setNotifications((prev) => [...prev, notification]);
        playSound();
      });
    }

    return () => {
      window.removeEventListener("click", unlockAudio);
      if (socket) {
        socket.off("new-notification");
      }
    };
  }, [socket]);

  return {
    notifications,
    socket,
    setNotifications,
  };
};
