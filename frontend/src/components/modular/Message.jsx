import styles from "./Message.module.css"; 


const Message = ({ content, isOwn }) => {
  return (
    <div className={`${styles["message"]} ${isOwn ? styles["own"] : styles["other"]}`}>
      <p>{content}</p>
    </div>
  );
};

export default Message;
