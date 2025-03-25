import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { LoaderCircle } from 'lucide-react';

interface ContactMapProps {
    apiKey: string;
    center: {
        lat: number;
        lng: number;
    };
    zoom?: number;
    containerStyle?: React.CSSProperties;
}

export const ContactMap = ({
    apiKey,
    center,
    zoom = 12,
    containerStyle = { width: '100%', height: '400px' }
}: ContactMapProps) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
    });

    if (loadError) return <div>Erro ao carregar o mapa</div>;
    if (!isLoaded) return <LoaderCircle  />;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={zoom}
            center={center}
        >
            <Marker position={center} />
        </GoogleMap>
    );
};