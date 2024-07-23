import styles from "./card.module.css";
import { PropsWithChildren } from "react";

type Status = "fresh" | "stale" | "aged" | "neutral";

interface CardProps {
  status: Status;
}

function Card({ status, children }: PropsWithChildren<CardProps>) {
  const borderColorMap = {
    // https://palettes.shecodes.io/palettes/6
    fresh: "#a8e6cf",
    stale: "#ffd3b6",
    aged: "#ffaaa5",
    neutral: "#bbb",
  };

  const borderColor = borderColorMap[status] || "#bbb";

  return (
    <div className={styles.card} style={{ borderColor: borderColor }}>
      {children}
    </div>
  );
}

export default Card;
