import { brandIconResponse } from "@/lib/brand-icon";

// iPhone home-screen icon. iOS needs an opaque PNG and rounds the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return brandIconResponse(180);
}
