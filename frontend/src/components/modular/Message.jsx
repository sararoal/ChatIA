import styles from "./Message.module.css";
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css';


const Message = ({ content, isOwn }) => {
  return (
    <div className={
        isOwn
          ? `${styles["message"]} ${styles["own"]}`
          : `markdown-body ${styles["message"]} ${styles["other"]}`
      }>
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Message;
