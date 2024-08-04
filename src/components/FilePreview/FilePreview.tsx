import { PropsWithChildren } from "react";
import styles from "./filePreview.module.css";
import { useState } from "react";

interface FilePreviewProps {
  file: File;
}

function FilePreview({ file, children }: PropsWithChildren<FilePreviewProps>) {
  const [thumbnail, setThumbnail] = useState<string>();
  const reader = new FileReader();
  reader.onload = () => setThumbnail(reader.result as string | undefined);
  reader.readAsDataURL(file);

  return (
    <div className={styles.file}>
      <img src={thumbnail} className={styles.thumbnail}></img>
      <p className={styles.fileName}>{file.name}</p>
      {children}
    </div>
  );
}

export default FilePreview;
