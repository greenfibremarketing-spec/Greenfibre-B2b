export default function JsonLd({ data }) {
  if (!data) return null;

  // Render JSON-LD script, safely escaping '<' as \u003c to prevent script injection
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
