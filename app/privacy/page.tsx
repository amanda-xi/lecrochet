import type { Metadata } from "next";
import PrivacyPage from "./client";

export const metadata: Metadata = {
    title: "Privacy Policy | Le Crochet",
    description: "Read the Le Crochet privacy policy.",
};

export default function Privacy() {
    return <PrivacyPage />;
} 