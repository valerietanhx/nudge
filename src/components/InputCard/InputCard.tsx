/// <reference types="chrome-types/index.d.ts"/>

import { useState, ChangeEvent, FormEvent, DragEvent } from "react";
import Card from "../Card/Card";
import IconButton from "../IconButton/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import styles from "./inputCard.module.css";
import { ItemData } from "../../globals/types";

function InputCard() {
  const [itemData, setItemData] = useState<ItemData>({
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
    setItemData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFile = (file: File) => {
    setItemData((prevData) => ({ ...prevData, file }));
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
    return !!(itemData.url || itemData.text || itemData.file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("At least one field must be filled.");
      return;
    }
    const key = Date.now();
    chrome.storage.local.set({ [key]: itemData }, () => {
      setItemData({ url: "", file: undefined, text: "", isCompleted: false });
    });
  };

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const items = e.dataTransfer.items;

    if (items.length > 1) {
      setIsDragOver(false);
      return alert("Please drop only one file at a time.");
    }
    if (items.length === 0) return;

    const item = items[0];
    const entry = item.webkitGetAsEntry();

    if (!entry) {
      setIsDragOver(false);
      return;
    }

    if (entry.isDirectory) {
      setIsDragOver(false);
      alert("Please only drop files, not directories.");
    } else if (entry.isFile) {
      const file = item.getAsFile();
      if (file) {
        handleFile(file);
        setIsDragOver(false);
      }
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const resetFileInput = () => {
    setItemData((prevData) => ({ ...prevData, file: undefined }));
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
        {itemData.file && (
          <div className={styles.file}>
            <img src={thumbnail} className={styles.thumbnail}></img>
            <p className={styles.fileName}>{itemData.file.name}</p>
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
            value={itemData.url}
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
            value={itemData.text}
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
