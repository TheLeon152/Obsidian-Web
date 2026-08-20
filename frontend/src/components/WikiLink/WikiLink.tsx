import "./WikiLink.css";

import type { MouseEvent } from "react";

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
    event: MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    onClick(target);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="wiki-link"
    >
      {displayText ?? target}
    </button>
  );
}