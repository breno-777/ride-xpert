import { IDriver } from '@/interfaces/driver.interface';
import styles from './map.module.scss'
import { PageContext } from "@/hooks/context/page/PageContext";
import { handleEstimateRide } from '@/utils/handles/rides';
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useState } from "react";
import { DriverCard } from '../cards/driver/driver';
import { Button } from '../buttons';

export const Directions = () => {
    const context = useContext(PageContext);
    if (!context) throw new Error("Context is required!");

    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState<number>(0);
    const selectedRoute = routes[routeIndex];
    const leg = selectedRoute?.legs[0];

    const [options, setOptions] = useState<IDriver[]>([]);

    useEffect(() => {
        if (!routesLibrary || !map) return;

        const service = new routesLibrary.DirectionsService();
        const renderer = new routesLibrary.DirectionsRenderer({
            map,
        });

        setDirectionsService(service);
        setDirectionsRenderer(renderer);
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        directionsService
            .route({
                origin: context.originPoint?.geometry?.location || '',
                destination: context.destinationPoint?.geometry?.location || '',
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true,
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
                directionsRenderer.setOptions({
                    polylineOptions: {
                        strokeColor: '#1bb3ff',
                        strokeWeight: 3,
                    },
                });
                setRoutes(response.routes);
            })
            .catch((error) => {
                console.error("Error fetching directions:", error);
            });
    }, [context.originPoint, context.destinationPoint, directionsRenderer, directionsService]);

    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);

    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;
    return (
        <div className={styles.directions}>
            <div>
                <h3>{selectedRoute.summary}</h3>
                <p>{leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}</p>
                <p>Distance: {leg.distance?.text}</p>
                <p>Duration: {leg.duration?.text}</p>
            </div>

            <ul>
                <h3>Other Routes</h3>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                        <div className={styles.route_selection} onClick={() => setRouteIndex(index)}>
                            {route.summary}
                        </div>
                    </li>
                ))}
            </ul>

            <div className={styles.confirm_button_container}>
                <Button
                    variant='primary'
                    onClick={() => {
                        const origin = context.originPoint?.formatted_address;
                        const destination = context.destinationPoint?.formatted_address;

                        if (origin && destination && context.customer) {
                            handleEstimateRide(
                                context.customer.id,
                                origin,
                                destination,
                                context.addNotification
                            ).then(result => {
                                context.setRide({
                                    destination: result.destination,
                                    origin: result.origin,
                                    distance: result.distance,
                                    duration: result.duration,
                                });
                                setOptions(result.options);
                            });
                        }
                    }}
                >
                    Confirm
                </Button>
            </div>

            {options && (
                <div className={styles.drivers_list_container}>
                    {options.map((driver, index) => (
                        <DriverCard driver={driver} key={index} />
                    ))}
                </div>
            )}
        </div>
    );
}

