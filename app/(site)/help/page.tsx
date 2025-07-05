import type { Metadata } from "next";
import HelpCenterPage from "./client";

export const metadata: Metadata = {
    title: "Help Center | Le Crochet",
    description: "Find answers to your questions about Le Crochet.",
};

export default function HelpCenter() {
    return <HelpCenterPage />;
} 