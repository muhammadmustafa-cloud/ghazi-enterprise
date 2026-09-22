import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({ label, title, description, linkTo, linkText }) {
  return (
    <div className="mb-12 flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {label && <p className="label-caps mb-3">{label}</p>}
        <h2 className="heading-display text-3xl sm:text-4xl md:text-[2.75rem]">{title}</h2>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{description}</p>
        )}
      </div>
      {linkTo && linkText && (
        <Link
          href={linkTo}
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent"
        >
          {linkText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
