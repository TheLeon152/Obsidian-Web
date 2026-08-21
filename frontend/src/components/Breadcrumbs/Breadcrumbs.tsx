import "./Breadcrumbs.css";


interface BreadcrumbsProps {
  path: string;
  onNavigate: (
    path: string
  ) => void;
}


export function Breadcrumbs({
  path,
  onNavigate,
}: BreadcrumbsProps) {

  const parts =
    path
      .split("/")
      .filter(Boolean);


  if (parts.length === 0) {
    return null;
  }


  return (
    <nav
      className="breadcrumbs"
      aria-label="Breadcrumb"
    >

      {parts.map(
        (part, index) => {

          const isLast =
            index ===
            parts.length - 1;


          const targetPath =
            parts
              .slice(
                0,
                index + 1
              )
              .join("/");


          return (
            <span
              className="breadcrumb-item"
              key={targetPath}
            >

              {index > 0 && (
                <span
                  className="breadcrumb-separator"
                  aria-hidden="true"
                >
                  ›
                </span>
              )}


              {isLast ? (
                <span
                  className="breadcrumb-current"
                  aria-current="page"
                >
                  {part.replace(
                    /\.md$/i,
                    ""
                  )}
                </span>
              ) : (
                <button
                  type="button"
                  className="breadcrumb-link"
                  onClick={() =>
                    onNavigate(
                      targetPath
                    )
                  }
                >
                  {part}
                </button>
              )}

            </span>
          );
        }
      )}

    </nav>
  );
}