import { useCallback, useContext, useState } from 'react';
import Header from '../components/Header';
import Nav from '../components/Nav';
import { PageTitles } from '../constants';
import ImageryContext from '../context/ImageryContext';
import ImageryType from '../types/ImageryType';
import DropZone from '../components/DropZone';

// From: https://blog.rocketseat.com.br/upload-de-imagens-no-front-end-com-react-js-e-context-api-3/
const Upload = () => {
  const [isDropActive, setIsDropActive] = useState<boolean>(false);
  const [files, setFiles] = useState<(File | null)[]>([]);
  const { handleUpload } = useContext(ImageryContext);

  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  const onFilesDrop = useCallback((filesParam: (File | null)[]) => {
    setFiles(prev => [...prev, ...filesParam]);
  }, []);

  const uploadImages = useCallback(() => {
    if (!files.length) {
      console.log('No images to upload!');
      return;
    }

    console.log(`${files.length} image(s) to upload...`);
    
    const s3Images:ImageryType[] = [];
    //files.map((img) => {
      console.log('saving ', files[0]?.name);
      s3Images.push({
        name: files[0]?.name, 
        src: files[0]?.name,
        alt: files[0]?.name,
        size: files[0]?.size,
        type: files[0]?.type,
      });
    //});

    handleUpload(s3Images)
      .then(() => {
        // echo success
      });
  }, [files]);

  return (
    <div className="container-fluid">
      <Nav />
      <Header text={PageTitles.upload} />
      <div className={`dropZoneWrapper ${isDropActive? 'dropZoneActive' : ''}`}>
        <DropZone
          onDragStateChange={onDragStateChange}
          onFilesDrop={onFilesDrop}
        >
          <h2 className='my-5'>Drop your files here</h2>

          {files.length === 0? (
            <p>No files to upload</p>
          ) : (
            <p>Files to upload: {files.length}</p>
          )}

        </DropZone>
      </div>
      <div className='text-center'>
        <button
          type='button'
          onClick={uploadImages}
          className='btn btn-outline-primary mt-3'
        >
          Upload images
        </button>
      </div>
    </div>
  );
}

export default Upload;
