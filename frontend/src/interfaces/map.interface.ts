export interface IMapHandler {
    place: google.maps.places.PlaceResult | null;
    marker: google.maps.marker.AdvancedMarkerElement | null;
}

export interface IPlaceAutocomplete {
    onDestinationSelect: (place: google.maps.places.PlaceResult | null) => void;
    onOriginSelect: (place: google.maps.places.PlaceResult | null) => void;
}