import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-emerald-900 text-paper hover:bg-emerald-700 border border-emerald-900",
  brass: "bg-brass-500 text-ink hover:bg-brass-400 border border-brass-500",
  outline: "bg-transparent text-content border border-content/25 hover:border-content hover:bg-content/[0.04]",
  outlineLight: "bg-transparent text-paper border border-paper/35 hover:border-paper hover:bg-paper/10",
  ghost: "bg-transparent text-content hover:bg-content/[0.05] border border-transparent",
  danger: "bg-[#8c2f24] text-paper hover:bg-[#a83b2d] border border-[#8c2f24]",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-3.5 text-[0.95rem]",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-medium tracking-wide rounded-full transition-[background-color,border-color,transform] duration-200 ease-out active:scale-[0.97] ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  const Comp = as || "button";
  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
}
