import tick3tLogo from "@assets/tick3t-light_1786308665024.png";

interface Tick3tMarkProps {
  className?: string;
}

const Tick3tMark = ({ className = "h-5 w-5" }: Tick3tMarkProps) => (
  <span
    aria-hidden="true"
    data-testid="tick3t-logo-mark"
    className={`relative inline-block shrink-0 overflow-hidden ${className}`}
  >
    <img
      src={tick3tLogo}
      alt=""
      className="absolute left-0 top-0 h-full w-auto max-w-none"
      style={{ clipPath: "inset(0 75% 0 0)" }}
    />
  </span>
);

export default Tick3tMark;