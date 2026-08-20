import "./NoteLink.css";

interface NoteLinkProps {
  name: string;
  path: string;
  direction?: "forward" | "backward";
  onClick: (path: string) => void;
}

export function NoteLink({
  name,
  path,
  direction = "forward",
  onClick,
}: NoteLinkProps) {
  return (
    <button
      type="button"
      className={`note-link note-link-${direction}`}
      onClick={() => onClick(path)}
    >
      <span className="note-link-icon">
        {direction === "forward" ? "→" : "←"}
      </span>

      <span className="note-link-name">
        {name}
      </span>
    </button>
  );
}