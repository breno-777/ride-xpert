import { IDriver } from '@/interfaces/driver.interface';
import styles from './driver.module.scss'
import { MdOutlineReviews, MdPriceCheck } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { handleConfirmRide } from '@/utils/handles/rides';
import { PageContext } from '@/hooks/context/page/PageContext';
import Image from 'next/image';
import vehicleIcon from '/public/assets/icons/car.svg'

interface DriverCardProps {
    driver: IDriver;
}

export const DriverCard = ({ driver }: DriverCardProps) => {
    const context = useContext(PageContext);
    const [showMore, setShowMore] = useState<boolean>(false);

    if (!context) throw new Error('Context is required');
    return (
        <div className={styles.container} onClick={() => {
            if (context.customer && context.ride) {
                handleConfirmRide(
                    context.customer.id,
                    context.ride.origin,
                    context.ride.destination,
                    context.ride.distance,
                    context.ride.duration,
                    driver,
                    context.addNotification
                )
            }
            context.clearRide();
        }
        }>
            <div className={styles.driver_main_details_container}>
                <Image src={vehicleIcon} alt='vehicle icon' width={64} height={64} />
                <div>
                    <h4>{driver.name}</h4>
                    <p>{driver.vehicle}</p>
                </div>
            </div>

            <div className={styles.rating_container}>
                <p><FaRegStar /> {driver.review?.rating}</p>
                <p><MdPriceCheck /> {driver.tax}/km</p>
                <p><MdPriceCheck /> {driver.value}</p>
            </div>

            <div className={styles.driver_description_container}>
                <div className={styles.show_more_container} onClick={() => setShowMore((prev) => !prev)}>
                    {showMore ? (<p>Show Less</p>) : (<p>Show More</p>)}
                    {showMore ? (<IoIosArrowUp />) : (<IoIosArrowDown />)}
                </div>

                <div className={`${styles.driver_review} ${!showMore && styles.hidden}`}>
                    <p>{driver.description}</p>

                    <p><MdOutlineReviews /> {driver.review?.comment}</p>
                </div>
            </div>

        </div>
    );
}