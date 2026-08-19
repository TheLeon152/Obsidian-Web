import { useEffect, useState } from "react";


interface VaultImageProps {
  path: string;
  alt?: string;
}


const API_BASE_URL =
  "http://localhost:8000";


export function VaultImage({
  path,
  alt,
}: VaultImageProps) {
  const [resolvedPath, setResolvedPath] =
    useState<string | null>(null);

  const [error, setError] =
    useState(false);


  useEffect(() => {
    async function resolveAsset() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/assets/resolve/${encodeURIComponent(path)}`
        );

        if (!response.ok) {
          throw new Error(
            "Asset could not be resolved."
          );
        }

        const data = await response.json();

        setResolvedPath(data.path);
      } catch {
        setError(true);
      }
    }

    resolveAsset();
  }, [path]);


  if (error) {
    return (
      <span>
        [Asset not found: {path}]
      </span>
    );
  }


  if (!resolvedPath) {
    return (
      <span>
        Loading image...
      </span>
    );
  }


  const encodedPath =
    resolvedPath
      .split("/")
      .map(encodeURIComponent)
      .join("/");


  const src =
    `${API_BASE_URL}/api/v1/assets/${encodedPath}`;


  return (
    <img
      src={src}
      alt={alt ?? ""}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
}