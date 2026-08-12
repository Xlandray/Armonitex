import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onDark?: boolean;
}

export default function Breadcrumbs({ items, onDark = false }: BreadcrumbsProps) {
  // Generate Schema.org BreadcrumbList JSON-LD
  const breadcrumbListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://armonitex.com.tr",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: item.href ? `https://armonitex.com.tr${item.href}` : undefined,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListJsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm ${
          onDark ? "text-on-navy-muted" : "text-muted-token"
        }`}
      >
        <Link
          href="/"
          className={onDark ? "hover:text-white-token transition-colors" : "hover:text-brand-token transition-colors"}
        >
          Ana Sayfa
        </Link>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-muted-token" aria-hidden>/</span>
            {item.href ? (
              <Link
                href={item.href}
                className={onDark ? "hover:text-white-token transition-colors" : "hover:text-brand-token transition-colors"}
              >
                {item.label}
              </Link>
            ) : (
              <span className={onDark ? "text-white-token" : "text-main-token font-medium"}>{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
