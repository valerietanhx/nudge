/// <reference types="chrome-types/index.d.ts"/>

import { useState, ChangeEvent, FormEvent, DragEvent } from "react";
import Card from "../Card/Card";
import IconButton from "../IconButton/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import styles from "./inputCard.module.css";
import { FormData } from "../../globals/types";

function InputCard() {
  const [formData, setFormData] = useState<FormData>({
    file: undefined,
    url: "",
    text: "",
    isCompleted: false,
  });
  const [thumbnail, setThumbnail] = useState<string>();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());

  const handleUploadClick = () => {
    document.getElementById("file")?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFile = (file: File) => {
    setFormData((prevData) => ({ ...prevData, file }));
    const reader = new FileReader();
    reader.onload = () => setThumbnail(reader.result as string | undefined);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const isFormValid = (): boolean => {
    return !!(formData.url || formData.text || formData.file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("At least one field must be filled.");
      return;
    }
    const key = Date.now();
    chrome.storage.local.set(
      { [key]: { ...formData, isCompleted: false } },
      () => {
        setFormData({ url: "", file: undefined, text: "", isCompleted: false });
      }
    );
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      // if the browser supports DataTransferItemList interface,
      // use DataTransferItemList interface to access the file(s)
      [...e.dataTransfer.items].forEach((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile()!;
          handleFile(file);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...e.dataTransfer.files].forEach((file) => {
        handleFile(file);
      });
    }
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const resetFileInput = () => {
    setFormData((prevData) => ({ ...prevData, file: undefined }));
    setFileInputKey(Date.now());
  };

  return (
    <Card status="neutral">
      <form
        autoComplete="off"
        method="post"
        onSubmit={handleSubmit}
        id="form"
        className={styles.form}
      >
        <div>
          <input
            id="file"
            type="file"
            name="file"
            className={styles.hide}
            onChange={handleFileChange}
            key={fileInputKey}
          ></input>
        </div>
        <div
          className={`${styles.fileUpload} ${
            isDragOver ? styles.dragOver : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadClick}
        >
          <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
          <p>
            {isDragOver
              ? "Drop file here to upload"
              : "Drag and drop a file, or click to browse"}
          </p>
        </div>
        {formData.file && (
          <div className={styles.file}>
            <img src={thumbnail} className={styles.thumbnail}></img>
            <p className={styles.fileName}>{formData.file?.name}</p>
            <div className={styles.iconButtonWrapper}>
              <IconButton
                icon={faTrashCan}
                onClick={() => {
                  resetFileInput();
                }}
              />
            </div>
          </div>
        )}
        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="url"
            name="url"
            value={formData.url}
            className={styles.block}
            onChange={handleChange}
            placeholder="https://example.com/"
          ></input>
        </div>
        <div>
          <label htmlFor="text">Note</label>
          <input
            id="text"
            type="text"
            name="text"
            value={formData.text}
            className={styles.block}
            onChange={handleChange}
          ></input>
        </div>
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
      </form>
    </Card>
  );
}

export default InputCard;
