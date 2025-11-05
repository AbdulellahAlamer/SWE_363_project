const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-5 py-2.5 font-semibold text-[0.95rem] text-slate-900 transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const VARIANT_CLASSNAMES = {
  primary: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
  secondary:
    "bg-white/80 text-blue-600 border-white/80 shadow-sm hover:bg-white",
  outline: "bg-transparent text-blue-600 border-blue-300 hover:border-blue-500",
  ghost: "bg-transparent text-slate-500 hover:text-slate-700",
  danger: "bg-white text-red-600 hover:bg-red-50",
  default: "bg-white text-slate-900",
};

function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...rest
}) {
  const variantKey = VARIANT_CLASSNAMES[variant] ? variant : "default";
  const classes = [BASE_CLASSES, VARIANT_CLASSNAMES[variantKey], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
