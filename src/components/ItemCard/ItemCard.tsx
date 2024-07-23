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
  date: Date;
}

function ItemCard({ date, children }: PropsWithChildren<ItemCardProps>) {
  const [isDone, setIsDone] = useState<boolean>(false);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const limit = 30;
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const toggleDone = () => {
    setIsDone(!isDone);
  };

  const handleDelete = () => {
    console.log("item deleted");
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
          Added {date.toLocaleDateString(navigator.language, options)}. Expires
          in {limit - diffDays} days.
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
