import type { Metadata } from "next";
import GalleryPage from "./client";

export const metadata: Metadata = {
    title: "Gallery | Le Crochet",
    description: "Explore a gallery of beautiful crochet patterns created by our community.",
};

export default function Gallery() {
    return <GalleryPage />;
} 