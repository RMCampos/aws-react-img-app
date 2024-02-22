import React, { useCallback, useEffect, useRef, useState } from 'react';
import './index.css';

export interface DropZoneProps {
  onDragStateChange?: (isDragActive: boolean) => void;
  onDragIn?: () => void;
  onDragOut?: () => void;
  onFilesDrop?: (files: (File | null)[]) => void;
}

const DropZone = ( props: React.PropsWithChildren<DropZoneProps> ) => {
  const {
    onDragStateChange,
    onFilesDrop,
    onDragIn,
    onDragOut,
  } = props;

  const [isDragActive, setIsDragActive] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  const mapFileListToArray = (files: FileList): (File | null)[] => {
    const array = [];

    for (let i = 0; i < files.length; i++) {
      array.push(files.item(i));
    }

    return array;
  }
  
  const handleDragIn = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onDragIn?.();

    if (event.dataTransfer && event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, [onDragIn]);

  const handleDragOut = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onDragOut?.();

    setIsDragActive(false);
  }, [onDragOut]);

  const handleDrag = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDragActive) {
      setIsDragActive(true);
    }
  }, [isDragActive]);

  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragActive(false);

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const files = mapFileListToArray(event.dataTransfer.files);
      onFilesDrop?.(files);
    }
    if (event.dataTransfer) {
      event.dataTransfer.clearData();
    }
  }, [onFilesDrop]);

  useEffect(() => {
    onDragStateChange?.(isDragActive);
  }, [isDragActive]);

  useEffect(() => {
    const tempZoneRef = dropZoneRef?.current;
    if (tempZoneRef) {
      tempZoneRef.addEventListener('dragenter', handleDragIn);
      tempZoneRef.addEventListener('dragleave', handleDragOut);
      tempZoneRef.addEventListener('dragover', handleDrag);
      tempZoneRef.addEventListener('drop', handleDrop);
    }

    // Remove listeners from dropzone on unmount:
    return () => {
      tempZoneRef?.removeEventListener('dragenter', handleDragIn);
      tempZoneRef?.removeEventListener('dragleave', handleDragOut);
      tempZoneRef?.removeEventListener('dragover', handleDrag);
      tempZoneRef?.removeEventListener('drop', handleDrop);
    }
  }, []);

  return (
    <div ref={dropZoneRef}>
      { props.children }
    </div>
  );
}


export default DropZone;
