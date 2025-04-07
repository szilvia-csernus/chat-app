import type { MetadataRoute } from "next";
 
 export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ChatAPP",
    short_name: "ChatApp",
    description: "ChatApp is a simple chat application",
    start_url: "/",
    display: "fullscreen",
    orientation: "portrait",
    scope: "/",
    lang: "en",
    theme_color: "#344664",
    background_color: "#344664",
    icons: [
     {
      src: "/web-app-manifest-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
     },
     {
      src: "/web-app-manifest-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
     },
     {
      src: "/web-app-manifest-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
     },
    ],
    crossorigin: "use-credentials"
  } as MetadataRoute.Manifest;
 }