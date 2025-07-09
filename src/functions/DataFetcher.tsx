import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';
import SelectorUI from '../components/SelectorUI';

interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

type Coordinates = {
  lat: number;
  lng: number;
};

const cityCoordinates: Record<string, Coordinates> = {
  Guayaquil: { lat: -2.170998, lng: -79.922359 },
  Quito: { lat: -0.180653, lng: -78.467834 },
  Manta: { lat: -0.967653, lng: -80.708910 },
  Cuenca: { lat: -2.900128, lng: -79.005896 },
};


export default function DataFetcher() : DataFetcherOutput {

    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState('');

    const handleCityChange = (newCity: string) => {
        setSelectedCity(newCity);
        alert(newCity + " seleccionado");
    };

    useEffect(() => {

        // Reemplace con su URL de la API de Open-Meteo obtenida en actividades previas
        const url = 'https://api.open-meteo.com/v1/forecast?latitude='+cityCoordinates[selectedCity].lat+'&longitude='+cityCoordinates[selectedCity].lng+'&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature';

        const fetchData = async () => {

            try {

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }

                const result: OpenMeteoResponse = await response.json();
                setData(result);

            } catch (err: any) {

                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error desconocido al obtener los datos.");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, []); // El array vacío asegura que el efecto se ejecute solo una vez después del primer renderizado

    return { data, loading, error };

}