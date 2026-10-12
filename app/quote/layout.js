// Route-level layout for /quote — server component so metadata can be exported.
// The page itself is a client component ("use client") and cannot export metadata directly.

export const metadata = {
  title: "Request a Bulk Quote",
  robots: { index: false, follow: false }
};

export default function QuoteLayout({ children }) {
  return children;
}
