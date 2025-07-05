import type { Metadata } from "next";
import MarketplacePage from "./client";

export const metadata: Metadata = {
    title: "Marketplace | Le Crochet",
    description: "Sell your patterns or discover unique designs from creators worldwide in our integrated marketplace.",
};

export default function Marketplace() {
    return <MarketplacePage />;
} 