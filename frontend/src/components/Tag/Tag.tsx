interface TagProps {
  tag: string;
  onClick?: (tag: string) => void;
}

export function Tag({
  tag,
  onClick,
}: TagProps) {
  return (
    <button
      type="button"
      className="obsidian-tag"
      onClick={() => onClick?.(tag)}
    >
      #{tag}
    </button>
  );
}