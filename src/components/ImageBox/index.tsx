
import './index.css';

export default function ImageBox() {
  const images = [];

  return (
    images.length === 0 ? (
      <div id="image-box">
        <h3>No images!</h3>
      </div>
    ) : (
      <div>New images!</div>
    )
  );
}
