import { logoPaths } from "@/lib/logo-paths";

const VIEW = "194 223 1612 1588";

/** Single-line trace of the real logo. With `solid`, the filled logo appears once the trace ends. */
export function LogoTrace({ size = 48, solid = false }: { size?: number; solid?: boolean }) {
  const stroke = (1.5 * 1612) / size;
  return (
    <svg className="trace" width={size} height={size} viewBox={VIEW} aria-hidden>
      {solid && <path className="solid" fillRule="evenodd" d={logoPaths.join("")} />}
      {logoPaths.map((d, i) => (
        <path key={i} className="draw" d={d} pathLength={1} strokeWidth={stroke} />
      ))}
    </svg>
  );
}
