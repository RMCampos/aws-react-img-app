import { useCallback, useContext, useState } from "react";
import ImageryContext from "../../context/ImageryContext";
import ImageryType from "../../types/ImageryType";

import './index.css';

export default function ImageBox() {
  const { getImages, handleUpload, getContent, deleteItem } = useContext(ImageryContext);
  const [ items, setItems ] = useState<ImageryType[]>([]);
  const [ text, setText ] = useState<string>('');
  const [ selected, setSelected ] = useState<string>('');

  const refresh = useCallback(async () => {
    const newImages = await getImages();
    if (newImages) {
      setItems(newImages);
    }
  }, []);

  const saveText = useCallback(() => {
    const item: ImageryType = {
      name: `item-${text.length}`,
      content: text
    };
    handleUpload(item)
      .then(() => {
        refresh();
        setText('');
      });
  }, [text]);

  const updateImages = useCallback((item: ImageryType) => {
    const newList: ImageryType[] = [];
    items.forEach((itemFor) => {
      if (itemFor.name === item.name) {
        newList.push(item);
      } else {
        newList.push(itemFor);
      }
    });

    setItems(newList);
  }, [items]);

  const processItem = useCallback(() => {
    const item = items.find(x => x.name === selected);
    if (item) {
      getContent(item.name)
        .then((imageryItem) => updateImages(imageryItem));
    }
  }, [items, selected]);

  const deleteItemFn = useCallback(() => {
    const item = items.find(x => x.name === selected);
    if (item) {
      deleteItem(item.name)
        .then(() => refresh())
        .catch((err) => console.error(err));
    }
  }, [items, selected]);

  return (
    <>
      <div className="row my-2">
        <div className="col-6">
          <div className="d-grid gap-2">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={refresh}
            >
              Get items
            </button>
          </div>
        </div>
        <div className="col-6">
          <div className="d-grid gap-2">
            <button className="btn btn-outline-primary" type="button">Delete all</button>
          </div>
        </div>
      </div>
      
      <form>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            id="text"
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon1"
            onClick={saveText}
          >
            Send to bucket
          </button>
        </div>
      </form>
      <div className="text-center">
        <h2>Items on Bucket</h2>
      </div>
      <div className="row my-2">
        <div className="col-6">
          <div className="d-grid gap-2">
            <button
              className="btn btn-outline-primary my-2 me-2"
              type="button"
              onClick={processItem}
              disabled={items.length === 0}
            >
              Get item content
            </button>
          </div>
        </div>
        <div className="col-6">
          <div className="d-grid gap-2">
            <button
              className="btn btn-outline-primary my-2"
              type="button"
              onClick={deleteItemFn}
              disabled={items.length === 0}
            >
              Delete item
            </button>
          </div>
        </div>
      </div>
      
      <ul className="list-group">
        {items?.map((image) => (
          <li className="list-group-item" key={image.name}>
            <input
              className="form-check-input me-1"
              type="radio"
              name="listGroupRadio"
              value={image.name}
              id={image.name}
              checked={selected === image.name}
              onChange={(e) => setSelected(e.target.value)}
            />
            <label
              className="form-check-label bucket-item"
              htmlFor={image.name}
            >
              {image.name} {image.content !== ''? `- ${image.content}` : ''}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
