import { Button } from '@/components/buttons';
import styles from './add.module.scss';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from '@/hooks/context/page/PageContext';
import { IoAdd, IoCameraOutline, IoDownloadOutline } from 'react-icons/io5';
import { handleAddCustomer } from '@/utils/handles/customers';
import { ICustomer } from '@/interfaces/customer.interface';

export const AddCustomerModal = () => {
    const context = useContext(PageContext);
    const [name, setName] = useState<string>('');
    const [userContent, setCustomerContent] = useState();

    useEffect(() => {
        setName('');
        if (context && userContent) {
            setCustomer(userContent)
        }
    }, [context, userContent])

    if (!context) return null;
    const { isAddCustomerModalOpen, toggleAddCustomerModal, setCustomer } = context;
    if (!isAddCustomerModalOpen) return null;

    const customerData: Partial<ICustomer> = {
        name: name,
        history: [],
    }

    const handleCreateCustomer = async () => {
        try {
            const response = await handleAddCustomer(name, context.addNotification);
            setCustomerContent(response);
            setCustomer(response);
            toggleAddCustomerModal();
        } catch (error) {
            console.error("Failed to create customer:", error);
        }
    };

    return (
        <div className={styles.contianer}>
            <div className={styles.modal_container}>
                <div className={styles.left_side} />
                <div className={styles.right_side} >
                    <p className={styles.title}>New Customer</p>
                    <div className={styles.user_avatar_container}>
                        {customerData ? (
                            <IoCameraOutline size={32} />
                        ) : (
                            <IoAdd size={46} className={styles.icon} />
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder='Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className={styles.buttons_container}>
                        <Button variant='danger' outline onClick={() => toggleAddCustomerModal()}>Cancel</Button>
                        <Button variant='primary' onClick={() => handleCreateCustomer()}>Create</Button>
                    </div>

                    <div className={styles.divider_container}>
                        <div className={styles.divider} />
                        <p>Or</p>
                        <div className={styles.divider} />
                    </div>

                    <div className={styles.import_container}>
                        <p>Import existing customer</p>
                        <IoDownloadOutline size={22} />
                    </div>
                </div>

            </div>
        </div >
    )
}