import styles from './customer.module.scss'
import { ICustomer } from '@/interfaces/customer.interface'
import { useContext } from 'react'
import { PageContext } from '@/hooks/context/page/PageContext'
import { BsPersonCircle } from 'react-icons/bs'

export const CustomerCard = ({ customer }: { customer: ICustomer }) => {
    const context = useContext(PageContext);
    return (
        <div className={styles.container} onClick={() => { context?.setCustomer(customer) }}>
            <BsPersonCircle size={48} />

            <h2>{customer.name}</h2>
            <h2>{customer.id}</h2>
        </div>
    )
}