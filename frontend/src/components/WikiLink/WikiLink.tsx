interface WikiLinkProps {
  target: string;
  displayText?: string;
  onClick: (target: string) => void;
}

export function WikiLink({
  target,
  displayText,
  onClick,
}: WikiLinkProps) {
  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    onClick(target);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        border: "none",
        padding: 0,
        background: "none",
        cursor: "pointer",
        color: "inherit",
        textDecoration: "underline",
      }}
    >
      {displayText ?? target}
    </button>
  );
}