import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./iconButton.module.css";

interface IconButtonProps {
  icon: IconProp;
  color?: string;
  onClick: () => void;
}

function IconButton({
  icon,
  color = "var(--medium-grey)",
  onClick,
}: IconButtonProps) {
  return (
    <button
      className={styles.button}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className={styles.icon} />
    </button>
  );
}

export default IconButton;
