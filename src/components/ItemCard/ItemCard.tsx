/// <reference types="chrome-types/index.d.ts"/>

import { PropsWithChildren } from "react";
import Card from "../Card/Card";
import styles from "./itemCard.module.css";
import IconButton from "../IconButton/IconButton";
import {
  faCheck,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface ItemCardProps {
  timestamp: number;
  isCompleted: boolean;
}

function ItemCard({
  timestamp,
  isCompleted,
  children,
}: PropsWithChildren<ItemCardProps>) {
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
    chrome.storage.local.get(timestamp.toString(), (result) => {
      if (result[timestamp.toString()]) {
        const item = result[timestamp.toString()];
        item.isCompleted = !item.isCompleted;
        chrome.storage.local.set({ [timestamp.toString()]: item });
      }
    });
  };

  const handleDelete = () => {
    chrome.storage.local.remove(timestamp.toString());
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
      <div className={styles.content}>{children}</div>
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
