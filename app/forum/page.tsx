import type { Metadata } from "next";
import ForumPage from "./client";

export const metadata: Metadata = {
    title: "Forum | Le Crochet",
    description: "Join the conversation in the Le Crochet community forum.",
};

export default function Forum() {
    return <ForumPage />;
} 