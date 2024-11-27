import { ICustomerHistory } from '@/interfaces/customer.interface';
import styles from './rideHistoryCard.module.scss'
import { FaMapMarker, FaMapMarkerAlt } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { MdOutlinePriceCheck } from "react-icons/md";
import { PiIdentificationCardThin } from "react-icons/pi";
import { RiPinDistanceFill } from "react-icons/ri";
import { IoCalendarOutline } from 'react-icons/io5';

export const RideHistoryCard = ({ item }: { item: ICustomerHistory }) => {
    return (
        <div className={styles.container}>
            <div className={styles.detail_container}><IoCalendarOutline /><p>{new Date(item?.date).toISOString().slice(0, 10).replace(/-/g, '/')}</p></div>
            <div className={styles.detail_container}><RiPinDistanceFill /><p>{item?.distance}</p></div>
            <div className={styles.detail_container}><PiIdentificationCardThin /><p>{item?.driver.name}</p></div>
            <div className={styles.detail_container}><LuClock4 /><p>{item?.duration}</p></div>
            <div className={styles.detail_container}><FaMapMarker /><p>{item?.destination}</p></div>
            <div className={styles.detail_container}><FaMapMarkerAlt /><p>{item?.origin}</p></div>
            <div className={styles.detail_container}><MdOutlinePriceCheck /><p>{item?.driver.value}</p></div>
        </div>
    );
}