export const decodeBase64 = (data?: string | null): string => {
  if (!data) return "";
  if (typeof window === "undefined") {
    // server
    return Buffer.from(data, "base64").toString("utf-8");
  }
  // browser
  return atob(data);
};
