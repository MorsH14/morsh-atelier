import type { Kind } from "@/lib/products";

/**
 * Line-drawn "plate" illustrations. A deliberate stand-in for MorsH's own 3D renders:
 * swap the <Plate> in ProductCard for an <Image> and nothing else changes.
 */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.1, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Shape({ kind }: { kind: Kind }) {
  switch (kind) {
    case "sofa":
      return (
        <g {...S}>
          <rect x="62" y="104" width="196" height="46" rx="16" />
          <rect x="74" y="72" width="172" height="40" rx="18" />
          <rect x="52" y="92" width="30" height="58" rx="14" />
          <rect x="238" y="92" width="30" height="58" rx="14" />
          <path d="M120 112v36M178 112v36" />
          <path d="M70 150v14M250 150v14M120 150v14M200 150v14" />
        </g>
      );
    case "table":
      return (
        <g {...S}>
          <ellipse cx="160" cy="112" rx="92" ry="20" />
          <ellipse cx="160" cy="118" rx="92" ry="20" />
          <path d="M120 128v26c0 8 80 8 80 0v-26" />
          <ellipse cx="160" cy="154" rx="40" ry="8" />
        </g>
      );
    case "lamp":
      return (
        <g {...S}>
          <path d="M130 52h60l14 52h-88z" />
          <ellipse cx="160" cy="52" rx="30" ry="6" />
          <path d="M160 104v62" />
          <ellipse cx="160" cy="170" rx="30" ry="6" />
        </g>
      );
    case "chair":
      return (
        <g {...S}>
          <path d="M104 72c0-12 12-20 28-20h56c16 0 28 8 28 20l-6 54h-100z" />
          <rect x="94" y="116" width="132" height="34" rx="16" />
          <path d="M160 150v18" />
          <ellipse cx="160" cy="172" rx="38" ry="7" />
        </g>
      );
    case "bed":
      return (
        <g {...S}>
          <rect x="70" y="40" width="180" height="76" rx="10" />
          <path d="M70 66h180M70 92h180M130 40v76M190 40v76" strokeOpacity=".4" />
          <rect x="52" y="116" width="216" height="36" rx="8" />
          <rect x="84" y="102" width="68" height="20" rx="10" />
          <rect x="168" y="102" width="68" height="20" rx="10" />
          <path d="M62 152v14M258 152v14" />
        </g>
      );
    case "console":
      return (
        <g {...S}>
          <rect x="46" y="84" width="228" height="56" rx="4" />
          <path d="M84 84v56M122 84v56M160 84v56M198 84v56M236 84v56" strokeOpacity=".45" />
          <path d="M66 140v28M254 140v28" />
          <path d="M156 106h8M156 118h8" />
        </g>
      );
  }
}

export default function Plate({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 320 220" className="plate" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`glow-${kind}`} cx="50%" cy="48%" r="60%">
          <stop offset="0%" stopColor="#b79b6a" stopOpacity=".22" />
          <stop offset="100%" stopColor="#b79b6a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="220" fill={`url(#glow-${kind})`} />
      <ellipse cx="160" cy="176" rx="120" ry="10" fill="#000" opacity=".28" />
      <Shape kind={kind} />
    </svg>
  );
}
