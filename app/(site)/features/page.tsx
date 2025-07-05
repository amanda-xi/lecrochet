import type { Metadata } from "next";
import FeaturesPage from "./client";

export const metadata: Metadata = {
    title: "Features | Le Crochet",
    description: "Discover the powerful features of Le Crochet to create, visualize, and share crochet patterns.",
};

export default function Features() {
    return <FeaturesPage />;
} 