/// <reference types="chrome-types/index.d.ts"/>

import Card from "../Card/Card";
import styles from "./itemCard.module.css";
import IconButton from "../IconButton/IconButton";
import {
  faCheck,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FormData } from "../../globals/types";

interface ItemCardProps {
  timestamp: number;
  formData: FormData;
}

function ItemCard({ timestamp, formData }: ItemCardProps) {
  const { file, url, text, isCompleted } = formData;
  const key = timestamp.toString();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const limit = 30; // TODO: use context instead?
  const diffTime = Math.abs(Date.now() - timestamp);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const toggleDone = () => {
    chrome.storage.local.get(key, (result) => {
      if (result[key]) {
        const item = result[key];
        item.isCompleted = !item.isCompleted;
        chrome.storage.local.set({ [key]: item });
      }
    });
  };

  const handleDelete = () => {
    chrome.storage.local.remove(key);
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
        {
          // TODO
          file && <div>Look, a file!</div>
        }
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
