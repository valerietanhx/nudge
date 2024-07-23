import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./iconButton.module.css";

interface IconButtonProps {
  icon: IconProp;
  onClick: () => void;
}

function IconButton({ icon, onClick }: IconButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      <FontAwesomeIcon icon={icon} className={styles.icon} />
    </button>
  );
}

export default IconButton;
