import type { ReactNode } from "react";


interface CalloutProps {
  type: string;
  title: string;
  children: ReactNode;
}


const icons: Record<string, string> = {
  note: "ℹ",
  info: "ℹ",
  tip: "💡",
  success: "✓",
  warning: "⚠",
  danger: "⚠",
  error: "✕",
  question: "?",
  example: "▣",
};


export function Callout({
  type,
  title,
  children,
}: CalloutProps) {
  const icon =
    icons[type] ?? "ℹ";


  return (
    <aside
      className={`obsidian-callout obsidian-callout-${type}`}
    >
      <div className="obsidian-callout-title">
        <span className="obsidian-callout-icon">
          {icon}
        </span>

        <span>
          {title}
        </span>
      </div>

      <div className="obsidian-callout-content">
        {children}
      </div>
    </aside>
  );
}