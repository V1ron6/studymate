export default function PageHead({ icon: Icon, title, subtitle }) {
  return (
    <div className="page-head">
      <span className="icon-badge"><Icon size={18} /></span>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
