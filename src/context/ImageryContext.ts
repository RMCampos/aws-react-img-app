import { createContext } from "react";
import ImageryType from "../types/ImageryType";

interface ImageryContextData {
  getImages(): Promise<ImageryType[] | null>;
  handleUpload(item: ImageryType): Promise<void>;
  getContent(key: string): Promise<ImageryType>;
  deleteItem(key: string): Promise<void>;
}

const ImageryContext = createContext<ImageryContextData>({} as ImageryContextData);

export default ImageryContext;
