import styles from './map.module.scss';

import {
    AdvancedMarker,
    APIProvider,
    Map,
    useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { useLoadScript } from '@react-google-maps/api';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from '@/hooks/context/page/PageContext';
import { MapHandler } from './MapHandler';
import { PlaceAutocomplete } from './PlaceAutocomplete';
import { Button } from '../buttons';
import Image from 'next/image';

const apiKey = process.env.GOOGLE_API_KEY || 'Invalid API Key';

export default function MapComponent() {
    let libraries;
    useEffect(() => {
        libraries = ['places']
    }, []);
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries
    });

    if (!isLoaded) return <div>Loading Maps...</div>;
    return <MapContent />
}

export const MapContent: React.FC = () => {
    const context = useContext(PageContext);
    if (!context) throw new Error("Context is required!");

    const [selectedPlace,] = useState<google.maps.places.PlaceResult | null>(null);
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
        <>
            <APIProvider
                apiKey={apiKey}
                solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'
            >
                <div className={styles.container}>
                    <Map
                        defaultZoom={8}
                        minZoom={4}
                        fullscreenControl={false}
                        streetViewControl={false}
                        mapTypeControl={false}
                        zoomControl={false}
                        mapId={'b5e4a33fb0e3af35'}
                        gestureHandling={'greedy'}
                        backgroundColor={'white'}
                        keyboardShortcuts={false}
                        defaultCenter={{ lat: -23.6820621, lng: -46.9256314 }}
                    >
                        <AdvancedMarker ref={markerRef} position={null} />
                    </Map>

                    <div className={`${styles.autocomplete_container} ${context.isAutocompleteHidden && styles.hidden}`}>
                        <div className={styles.autocomplete_control}>
                            <PlaceAutocomplete
                                onOriginSelect={(place) => {
                                    if (place) context.setOrigin(place);
                                }}
                                onDestinationSelect={(place) => {
                                    if (place) context.setDestination(place);
                                }}
                            />
                        </div>
                    </div>

                    <MapHandler place={selectedPlace} marker={marker} />

                    <div className={`${styles.button_container} ${!context.isAutocompleteHidden && styles.hidden}`}>
                        <Button variant='primary' onClick={() => {
                            context.toggleSidebar();
                            context.toggleAutocomplete();
                        }}>
                            <Image src={'/assets/icons/map.gif'} alt='travel-button-icon' width={32} height={32} /> Start Travel
                        </Button>
                    </div>
                </div>
            </APIProvider>
        </>
    );
}

