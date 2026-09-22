export default function PageHeader({ tag, title, description, dark = false, children }) {
  return (
    <header className={`pt-28 ${dark ? 'bg-void text-white' : 'bg-snow'}`}>
      <div className="container-main pb-14 pt-10 md:pb-20">
        {tag && (
          <span className={dark ? 'tag mb-5' : 'tag-dark mb-5'}>{tag}</span>
        )}
        <h1 className={`headline-lg max-w-3xl ${dark ? 'text-white' : ''}`}>{title}</h1>
        {description && (
          <p className={`mt-5 max-w-xl text-base leading-relaxed ${dark ? 'text-white/50' : 'text-smoke'}`}>
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
