import { IoAdd } from "react-icons/io5"
import styles from './addCustomerCard.module.scss'
import { useContext } from "react"
import { PageContext } from "@/hooks/context/page/PageContext"
import { MdPerson } from "react-icons/md"
import { ICustomer } from "@/interfaces/customer.interface"

export const AddCustomerCard = ({ customerData }: { customerData: ICustomer | null }) => {
    const context = useContext(PageContext);

    const handleClick = () => {
        if (customerData) {
            context?.setCustomer(customerData);
        } else {
            context?.toggleAddCustomerModal();
        }
    };

    return (
        <div className={styles.container} onClick={() => handleClick()}>
            <div className={styles.user_avatar_container}>
                {customerData ? (
                    <div className={styles.icon_avatar_container}>
                        <MdPerson size={48} />
                    </div>
                ) : (
                    <IoAdd size={46} className={styles.icon} />
                )}
            </div>
            <p className={styles.user_name}>{customerData ? customerData.name : 'Create new customer'} </p>
        </div>
    )
}