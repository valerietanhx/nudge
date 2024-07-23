import { PropsWithChildren } from "react";
import Card from "../Card/Card";
import styles from "./itemCard.module.css";
import IconButton from "../IconButton/IconButton";
import { faCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface ItemCardProps {
  date: Date;
}

function ItemCard({ date, children }: PropsWithChildren<ItemCardProps>) {
  const LIMIT = 30;

  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <Card status={diffDays <= 10 ? "fresh" : diffDays <= 20 ? "stale" : "aged"}>
      <div className={styles.content}>{children}</div>
      <hr></hr>
      <div className={styles.footer}>
        <div className={styles.metadata}>
          Added {date.toLocaleDateString(navigator.language, options)}. Expires
          in {LIMIT - diffDays} days.
        </div>
        <div className={styles.buttons}>
          <IconButton icon={faCheck} onClick={() => console.log("item done")} />
          <IconButton
            icon={faTrashCan}
            onClick={() => console.log("item deleted")}
          />
        </div>
      </div>
    </Card>
  );
}

export default ItemCard;
