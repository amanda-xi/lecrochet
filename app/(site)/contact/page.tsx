import type { Metadata } from "next";
import ContactPage from "./client";

export const metadata: Metadata = {
    title: "Contact | Le Crochet",
    description: "Get in touch with the Le Crochet team.",
};

export default function Contact() {
    return <ContactPage />;
} 