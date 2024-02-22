import { createContext } from "react";
import ImageryType from "../types/ImageryType";

interface ImageryContextData {
  images: ImageryType[] | [];
  getImages(): Promise<string[] | null>;
  handleUpload(newImages: ImageryType[]): Promise<void>;
}

const ImageryContext = createContext<ImageryContextData>({} as ImageryContextData);

export default ImageryContext;
