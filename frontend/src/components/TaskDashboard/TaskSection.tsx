import type { ReactNode } from "react";


interface TaskSectionProps {
  title: string;
  count?: number;
  children: ReactNode;
}


export function TaskSection({
  title,
  count,
  children,
}: TaskSectionProps) {

  return (
    <section
      style={{
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <h2
          style={{
            margin: 0,
          }}
        >
          {title}
        </h2>

        {count !== undefined && (
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85em",
            }}
          >
            {count}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}