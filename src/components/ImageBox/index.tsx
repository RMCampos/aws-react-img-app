import { useContext, useEffect } from "react";

import './index.css';
import ImageryContext from "../../context/ImageryContext";

export default function ImageBox() {
  const { images, getImages } = useContext(ImageryContext);

  useEffect(() => {
    console.log(`Images length changed: ${images.length}`);
    getImages();
  }, [images]);

  return (
    images.length === 0 ? (
      <div className="text-center">
        <h3>No images to show :(</h3>
        <p>Try uploading a new one!</p>
      </div>
    ) : (
      <div className="box-row">
        <div className="box-column">
          {images.map((image) => (
            <img key={image.src} src={image.src} alt={image.alt} />
          ))}
        </div>
      </div>
    )
  );
}
