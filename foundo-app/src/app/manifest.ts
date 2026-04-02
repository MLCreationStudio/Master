import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clip App",
    short_name: "Clip",
    description:
      "Founders encontram Builders de elite",
    start_url: "/",
    display: "standalone",
    background_color: "#13131A",
    theme_color: "#E8632A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
