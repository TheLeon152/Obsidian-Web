import "./NoteProperties.css";

interface NotePropertiesProps {
  frontmatter: Record<string, unknown>;
}

export function NoteProperties({
  frontmatter,
}: NotePropertiesProps) {
  const properties = Object.entries(
    frontmatter
  ).filter(([key]) => key !== "tags");

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="note-properties">
      <h2>Properties</h2>

      <table className="note-properties-table">
        <tbody>
          {properties.map(
            ([key, value]) => (
              <tr key={key}>
                <th>{key}</th>
                <td>
                  {formatPropertyValue(value)}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </section>
  );
}


function formatPropertyValue(
  value: unknown
): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        formatPropertyValue(item)
      )
      .join(", ");
  }

  if (
    typeof value === "object"
  ) {
    return JSON.stringify(value);
  }

  return String(value);
}