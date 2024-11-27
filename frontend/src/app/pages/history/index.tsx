import { useContext, useEffect } from 'react';
import styles from './history.module.scss'
import { PageContext } from '@/hooks/context/page/PageContext';
import { handleGetCustomerHistory } from '@/utils/handles/customers';
import { RideHistoryCard } from '@/components/cards/customer/history';
import { LuInbox } from 'react-icons/lu';

export default function HistoryPage() {
    const context = useContext(PageContext);
    if (!context) throw new Error('Context not available!');

    useEffect(() => {
        const fetchData = async () => {
            const id = context.customer?.id;
            if (id) await handleGetCustomerHistory(id, null, context.addNotification).then((response) => {
                context.setCustomerHistory(response);
                context.setOldCustomerHistory(response);
            });
        }
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            {context.customerHistory.length > 0 ? (
                context.customerHistory.map((item, index) => (
                    <div key={index}>
                        {item && (
                            <RideHistoryCard item={item} />
                        )}
                    </div>
                ))
            ) : (
                <div className={styles.empty_container}>
                    <LuInbox size={64} />
                    <p>No history available</p>
                </div>
            )}
        </div>
    );
}