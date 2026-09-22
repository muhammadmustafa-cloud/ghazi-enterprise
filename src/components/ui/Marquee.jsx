const items = [
  'CORRUGATED BOXES',
  'BULK WHOLESALE',
  'CUSTOM PRINTING',
  'SAME-DAY DISPATCH',
  '5-PLY INDUSTRIAL',
  'PACKAGING TAPE',
  'BUBBLE WRAP',
  'KARACHI · PAKISTAN',
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line bg-void-soft py-4">
      <div className="marquee-track flex w-max gap-12">
        {row.map((text, i) => (
          <span key={i} className="flex shrink-0 items-center gap-12 font-display text-sm font-bold uppercase tracking-[0.25em] text-white/40">
            {text}
            <span className="h-1.5 w-1.5 rounded-full bg-blaze" />
          </span>
        ))}
      </div>
    </div>
  );
}
