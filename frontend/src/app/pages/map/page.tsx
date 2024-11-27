'use client'

import styles from './map.module.scss';
import dynamic from 'next/dynamic';

const MapaComponent = dynamic(() => import('@components/map/'), {
    ssr: false,
});

export default function MapPage() {
    return (
        <div className={styles.container}>
            <MapaComponent />
        </div>
    );
}