/// <reference types="chrome-types/index.d.ts"/>

import { useState, PropsWithChildren } from "react";
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
}

function ItemCard({ timestamp, children }: PropsWithChildren<ItemCardProps>) {
  const [isDone, setIsDone] = useState<boolean>(false);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const limit = 30;
  const itemDate = new Date(timestamp);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - itemDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const toggleDone = () => {
    setIsDone(!isDone);
  };

  const handleDelete = () => {
    chrome.storage.local.remove(timestamp.toString());
  };

  return (
    <Card
      status={
        isDone
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
          Added {itemDate.toLocaleDateString(navigator.language, options)}.
          Expires in {limit - diffDays} days.
        </div>
        <div className={styles.buttons}>
          <IconButton icon={isDone ? faXmark : faCheck} onClick={toggleDone} />
          <IconButton icon={faTrashCan} onClick={handleDelete} />
        </div>
      </div>
    </Card>
  );
}

export default ItemCard;
