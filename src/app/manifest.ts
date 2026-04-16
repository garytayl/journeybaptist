import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Journey Baptist · Scripture preparation",
    short_name: "Journey Prepare",
    description:
      "Weekly Head, Heart, and Hands Scripture preparation for Journey Baptist.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f3ee",
    theme_color: "#faf8f5",
    icons: [],
  }
}
