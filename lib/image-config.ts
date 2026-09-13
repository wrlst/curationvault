import type { NextConfig } from "next";

// Reserved allowlist if runtime Next.js image optimization is enabled again.
// Static exports serve images directly: unoptimized images do not use this list.
export const remoteImagePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
];

export function normalizeExternalUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  const markdownUrl = value.match(/^\[[^\]]*\]\((https?:\/\/[^)]+)\)$/);
  return markdownUrl?.[1] ?? value;
}
