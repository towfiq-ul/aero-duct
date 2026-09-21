// lib/notifications.ts
// Push notification and alert scaffolding for technician PWA and dispatch workflows.

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isPushSupported()) {
    console.info("[Notifications] Push/Notifications not supported on this device.");
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error("[Notifications] Permission request error:", err);
    return "denied";
  }
}

export async function sendLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<boolean> {
  if (!isPushSupported()) return false;

  if (Notification.permission === "granted") {
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, {
          icon: "./logo.jpg",
          badge: "./logo.jpg",
          ...options,
        });
        return true;
      } else {
        new Notification(title, options);
        return true;
      }
    } catch (e) {
      console.warn("[Notifications] Failed to display notification", e);
      return false;
    }
  }

  return false;
}

/**
 * Scaffolding to register for remote Web Push via VAPID key
 */
export async function subscribeToWebPush(
  vapidPublicKey?: string
): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription && vapidPublicKey) {
      // Convert VAPID base64 key to Uint8Array
      const padding = "=".repeat((4 - (vapidPublicKey.length % 4)) % 4);
      const base64 = (vapidPublicKey + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray,
      });
    }

    return subscription;
  } catch (error) {
    console.error("[Notifications] Failed to subscribe to Web Push:", error);
    return null;
  }
}
