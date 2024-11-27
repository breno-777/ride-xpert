'use client'

import React, { useEffect, useState } from 'react';
import styles from './login.module.scss'
import { ICustomer } from '@/interfaces/customer.interface';
import { handleGetAllCustomers } from '@/utils/handles/customers';
import { AddCustomerModal } from '@/components/modals/customers/add';
import { AddCustomerCard } from '@/components/cards/customer/add';

export default function Login() {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            await handleGetAllCustomers().then((response) => {
                setCustomers(response);
            });
        }
        fetchData();
    }, []);
    return (
        <div className={styles.container}>
            <p className={styles.title}>Ride <span>Xpert</span></p>

            <div
                className={styles.customer_container}
                style={
                    { '--customer-quantity': customers.length >= 2 ? customers.length + 1 : customers.length >= 1 ? 2 : 1 } as React.CSSProperties
                }>
                {customers.length > 0 && (
                    customers.map((customer, index) => {
                        return (
                            <AddCustomerCard key={index} customerData={customer} />
                        )
                    })
                )}
                <AddCustomerCard customerData={null} />
            </div>

            <AddCustomerModal />
        </div>
    )
}


// import { useContext, useEffect, useState } from 'react';
// import styles from './login.module.scss'
// import { handleAddCustomer, handleGetAllCustomers } from '@/utils/handles/customers';
// import { PageContext } from '@/hooks/context/page/PageContext';
// import { ICustomer } from '@/interfaces/customer.interface';
// import { CustomerCard } from '@/components/cards/customer';

// export default function LoginPage() {
//     const context = useContext(PageContext);
//     if (!context) throw new Error('Context not available!');

//     const [customers, setCustomers] = useState<ICustomer[]>([]);
//     const [customerName, setCustomerName] = useState<string>('');

//     const handleSubmit = () => {
//         handleAddCustomer(customerName).then((response) => {
//             context.setCustomer(response);
//         });
//     }

//     useEffect(() => {
//         const fetchData = async () => {
//             await handleGetAllCustomers().then((response) => {
//                 setCustomers(response);
//             })
//         }
//         fetchData();
//     }, []);
//     return (
//         <div className={styles.container}>
//             <input
//                 type="text"
//                 placeholder="Customer Name"
//                 value={customerName}
//                 onChange={e => setCustomerName(e.target.value)}
//             />

//             <button
//                 type='submit' onClick={() => handleSubmit()}
//             >
//                 Create new Customer
//             </button>

//             {customers.map(customer => (
//                 <div key={customer.id} >
//                     <CustomerCard customer={customer} />
//                 </div>
//             ))
//             }
//         </div >
//     );
// }