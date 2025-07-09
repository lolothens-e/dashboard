import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';
import SelectorUI from './SelectorUI';

interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

const cityCoordinates = {
  guayaquil: { lat: -2.170998, lon: -79.922359 },
  quito: { lat: -0.180653, lon: -78.467838 },
  manta: { lat: -0.951399, lon: -80.710174 },
  cuenca: { lat: -2.90055, lon: -79.00471 },
}as const;

type City = keyof typeof cityCoordinates;

export default function DataFetcher() : DataFetcherOutput {

    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCity, setSelectedCity] = useState<City | ''>('');

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
    };

    useEffect(() => {
        if (selectedCity) {
            const coords = cityCoordinates[selectedCity];
        }

        const url = 'https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicagohttps://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago';

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

    }, [selectedCity]); // El array vacío asegura que el efecto se ejecute solo una vez después del primer renderizado

    return { data, loading, error };

}