/// <reference types="chrome-types/index.d.ts"/>

import Card from "../Card/Card";
import styles from "./itemCard.module.css";
import IconButton from "../IconButton/IconButton";
import {
  faCheck,
  faDownload,
  faTrashCan,
  faUpRightFromSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ItemData, SubmittedItemData } from "../../globals/types";
import { openDB } from "idb";
import { DB_NAME, STORE_NAME } from "../../utils/db";
import FilePreview from "../FilePreview/FilePreview";

const limit = 30; // TODO: use context instead?

async function getItem(timestamp: number) {
  const db = await openDB(DB_NAME, 1);
  return db.get(STORE_NAME, timestamp);
}

async function updateItem(timestamp: number, itemData: ItemData) {
  const db = await openDB(DB_NAME, 1);
  return db.put(STORE_NAME, { timestamp, ...itemData });
}

async function deleteItem(timestamp: number) {
  const db = await openDB(DB_NAME, 1);
  return db.delete(STORE_NAME, timestamp);
}

interface ItemCardProps {
  submittedItemData: SubmittedItemData;
  onDBChange: () => void;
}

function ItemCard({ submittedItemData, onDBChange }: ItemCardProps) {
  const { timestamp, itemData } = submittedItemData;
  const { file, url, text, isCompleted } = itemData;

  let fileUrl: string;

  if (file) {
    fileUrl = URL.createObjectURL(file);
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const diffTime = Math.abs(Date.now() - timestamp);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const toggleDone = async () => {
    const item = await getItem(timestamp);
    if (item) {
      item.itemData.isCompleted = !item.itemData.isCompleted;
      await updateItem(timestamp, item);
      onDBChange();
    }
  };

  const handleDelete = async () => {
    await deleteItem(timestamp);
    onDBChange();
  };

  return (
    <Card
      status={
        isCompleted
          ? "neutral"
          : diffDays <= 10
          ? "fresh"
          : diffDays <= 20
          ? "stale"
          : "aged"
      }
    >
      <div className={styles.content}>
        {file && (
          <FilePreview file={file}>
            <IconButton
              icon={faUpRightFromSquare}
              color="var(--light-grey)"
              onClick={() => window.open(fileUrl)}
            />
            <IconButton
              icon={faDownload}
              color="var(--light-grey)"
              onClick={() =>
                chrome.downloads.download({
                  url: fileUrl,
                  filename: file.name,
                })
              }
            />
          </FilePreview>
        )}
        {url && (
          <a href={url} className={styles.wrap}>
            {url}
          </a>
        )}
        {text && <p className={styles.wrap}>{text}</p>}
      </div>
      <hr></hr>
      <div className={styles.footer}>
        <div className={styles.metadata}>
          Added{" "}
          {new Date(timestamp).toLocaleDateString(navigator.language, options)}.
          Expires in {limit - diffDays} days.
        </div>
        <div className={styles.buttons}>
          <IconButton
            icon={isCompleted ? faXmark : faCheck}
            onClick={toggleDone}
          />
          <IconButton icon={faTrashCan} onClick={handleDelete} />
        </div>
      </div>
    </Card>
  );
}

export default ItemCard;
