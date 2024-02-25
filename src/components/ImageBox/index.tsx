import { useContext, useEffect, useState } from "react";

import './index.css';
import ImageryContext from "../../context/ImageryContext";

export default function ImageBox() {
  const { getImages } = useContext(ImageryContext);
  const [ images, setImages ] = useState<string[] | null>([]);

  useEffect(() => {
    console.log(`Images length changed: ${images?.length}`);
    getImages()
      .then((imgs) => setImages(imgs));
  }, [images]);

  return (
    images?.length === 0 ? (
      <div className="text-center">
        <h3>No images to show :(</h3>
        <p>Try uploading a new one!</p>
      </div>
    ) : (
      <div className="box-row">
        <div className="box-column">
          {images?.map((image) => (
            <p key={image}>{image}</p>
          ))}
        </div>
      </div>
    )
  );
}
