import {
  useEffect,
  useState,
} from "react";

import { getFile } from "../../api/files";

import "./ImageViewer.css";


interface ImageViewerProps {
  path: string;
  name: string;
}


export function ImageViewer({
  path,
  name,
}: ImageViewerProps) {

  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {

    let objectUrl: string | null = null;

    async function loadImage() {

      setLoading(true);
      setError(null);

      try {

        const response =
          await getFile(path);

        const blob =
          await response.blob();

        objectUrl =
          URL.createObjectURL(blob);

        setImageUrl(objectUrl);

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load image.",
        );

      } finally {

        setLoading(false);

      }
    }


    loadImage();


    return () => {

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

    };

  }, [path]);


  if (loading) {
    return (
      <div className="file-viewer-state">
        Loading image...
      </div>
    );
  }


  if (error) {
    return (
      <div className="file-viewer-state file-viewer-state-error">
        Error: {error}
      </div>
    );
  }


  if (!imageUrl) {
    return (
      <div className="file-viewer-state">
        Image could not be loaded.
      </div>
    );
  }


  return (
    <article className="image-viewer">

      <header className="image-viewer-header">

        <h1 className="image-viewer-title">
          {name}
        </h1>

      </header>


      <div className="image-viewer-content">

        <img
          src={imageUrl}
          alt={name}
          className="image-viewer-image"
        />

      </div>

    </article>
  );
}