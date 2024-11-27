import { IDriver } from '@/interfaces/driver.interface';
import styles from './driver.module.scss'

interface DriverCardProps {
    driver: IDriver;
}

export const DriverCard = ({ driver }: DriverCardProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.main_details_container}>
                <div>
                    <h2>{driver.name}</h2>
                    <p>Vehicle: {driver.vehicle}</p>
                </div>
                <div>
                    <p>Review: 4.5/5 stars</p>
                    <p>Value: ${driver.tax}/km</p>
                </div>
            </div>

            <div className={styles.driver_review}>
                <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at est vel neque tempus bibendum. Nulla facilisi.</p>
            </div>
        </div>
    );
}