import { PageContext } from '@/hooks/context/page/PageContext';
import styles from './notification.module.scss'
import { useContext } from "react";
import { IoCloseOutline } from 'react-icons/io5';

const Notifications: React.FC = () => {
    const context = useContext(PageContext);

    if (!context) return null;
    const { notifications, removeNotification } = context;

    return (
        <div className={styles.container}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`${styles.card} ${notification.type === "error" ? styles.error : styles.success
                        }`}
                >
                    <p>{notification.message}</p>
                    <IoCloseOutline
                        className={styles.close_button}
                        size={26}
                        onClick={() => removeNotification(notification.id)} />
                </div>
            ))}
        </div>
    );
};

export default Notifications;
