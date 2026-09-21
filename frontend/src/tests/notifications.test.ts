import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
} from "../lib/notifications";

describe("lib/notifications", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("checks whether push is supported in environment", () => {
    expect(typeof isPushSupported()).toBe("boolean");
  });

  it("getNotificationPermission returns unsupported or current permission", () => {
    const perm = getNotificationPermission();
    expect(["unsupported", "default", "granted", "denied"]).toContain(perm);
  });

  it("handles requestNotificationPermission gracefully in test environment", async () => {
    const result = await requestNotificationPermission();
    expect(result).toBeDefined();
  });

  it("sendLocalNotification returns false when not granted or unsupported", async () => {
    const sent = await sendLocalNotification("Test Alert");
    expect(sent).toBe(false);
  });
});
