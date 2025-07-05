import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-lg font-light tracking-wide mb-4">Le Crochet</div>
            <p className="text-sm text-gray-600 font-light">The future of crochet pattern creation and sharing.</p>
          </div>
          <div>
            <h4 className="font-light mb-4">Product</h4>
            <div className="space-y-2">
              <Link href="/features" className="block text-sm text-gray-600 font-light hover:text-black">
                Features
              </Link>
              <Link href="/pricing" className="block text-sm text-gray-600 font-light hover:text-black">
                Pricing
              </Link>
              <Link href="/api" className="block text-sm text-gray-600 font-light hover:text-black">
                API
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-light mb-4">Community</h4>
            <div className="space-y-2">
              <Link href="/gallery" className="block text-sm text-gray-600 font-light hover:text-black">
                Gallery
              </Link>
              <Link href="/marketplace" className="block text-sm text-gray-600 font-light hover:text-black">
                Marketplace
              </Link>
              <Link href="/forum" className="block text-sm text-gray-600 font-light hover:text-black">
                Forum
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-light mb-4">Support</h4>
            <div className="space-y-2">
              <Link href="/help" className="block text-sm text-gray-600 font-light hover:text-black">
                Help Center
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 font-light hover:text-black">
                Contact
              </Link>
              <Link href="/privacy" className="block text-sm text-gray-600 font-light hover:text-black">
                Privacy
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-600 font-light">© 2024 Le Crochet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 