// Route-level layout for /quote — server component so metadata can be exported.
// The page itself is a client component ("use client") and cannot export metadata directly.

export const metadata = {
  title: "Request a Bulk Quote",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://trade.greenfibre.org/quote" }
};

export default function QuoteLayout({ children }) {
  return children;
}
