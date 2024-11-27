import { useContext, useEffect, useRef, useState } from "react";
import { PageContext } from "@/hooks/context/page/PageContext";
import { IPlaceAutocomplete } from "@/interfaces/map.interface";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

import styles from './map.module.scss';
import { Directions } from "./Directions";
import { IoSearchOutline } from "react-icons/io5";
import { FaMapMarker, FaMapMarkerAlt } from "react-icons/fa";

export const PlaceAutocomplete = ({ onOriginSelect, onDestinationSelect }: IPlaceAutocomplete) => {
    const context = useContext(PageContext);
    if (!context) throw new Error("Context is required!");

    const [, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [, setDestinationFilled] = useState<boolean>(false);

    const originInputRef = useRef<HTMLInputElement>(null);
    const destinationInputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary("places");


    useEffect(() => {
        if (!places || !originInputRef.current || !destinationInputRef.current) return;
        const options = {
            fields: ["geometry", "name", "formatted_address"]
        };

        const originAutocomplete = new places.Autocomplete(originInputRef.current, options);
        const destinationAutocomplete = new places.Autocomplete(destinationInputRef.current, options);

        setPlaceAutocomplete(originAutocomplete);

        originAutocomplete.addListener("place_changed", () => {
            const place = originAutocomplete.getPlace();
            onOriginSelect(place);
        });

        destinationAutocomplete.addListener("place_changed", () => {
            const place = destinationAutocomplete.getPlace();
            onDestinationSelect(place);
        });
    }, [places, onOriginSelect, onDestinationSelect]);

    return (
        <div className={styles.autocomple_contents_container}>
            <div className={styles.inputs_container} style={{ display: 'flex', flexDirection: 'column' }}>
                <h1 className={styles.title}>Where are we going?</h1>

                <div className={`${styles.input_container} ${context.destinationPoint && styles.hidden}`}>
                    <IoSearchOutline size={18} />
                    <input
                        ref={destinationInputRef}
                        placeholder="Destination"
                        required
                        onBlur={() => setDestinationFilled(true)}
                    />
                </div>

                <div className={`${styles.input_container} ${!context.destinationPoint && styles.hidden}`}>
                    <IoSearchOutline size={18} />
                    <input
                        ref={originInputRef}
                        placeholder="Origin"
                        required
                    />
                </div>

                <div className={`${styles.locations_container}`}>
                    <div className={`${styles.location} ${!context.destinationPoint && styles.hidden}`}>
                        <FaMapMarker /> <p>{context.destinationPoint?.formatted_address}</p>
                    </div>
                    <div className={`${styles.location} ${!context.originPoint && styles.hidden}`}>
                        <FaMapMarkerAlt /><p>{context.originPoint?.formatted_address}</p>
                    </div>
                </div>

                {context.originPoint && context.destinationPoint && <Directions />}
            </div>

            <p
                className={styles.cancel_button}
                onClick={() => {
                    context.clearRide();
                }}
            >Cancel</p>
        </div>
    );
};
