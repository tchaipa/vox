import "./PageHero.css";

export default function PageHero({ eyebrow, title, description, image }) {
  return (
    <section className="page-hero" style={image ? { backgroundImage: `url(${image})` } : undefined}>
      <div className="page-hero__scrim" />
      <div className="container page-hero__content">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
