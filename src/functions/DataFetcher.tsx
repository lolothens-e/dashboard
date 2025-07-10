import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface Props {
  city: string;
}

interface DataFetcherOutput {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

const coordinates: Record<string, { lat: number; lon: number }> = {
  guayaquil: { lat: -2.17, lon: -79.92 },
  quito: { lat: -0.18, lon: -78.47 },
  manta: { lat: -0.95, lon: -80.72 },
  cuenca: { lat: -2.90, lon: -79.00 },
};

export default function DataFetcher({ city }: Props): DataFetcherOutput {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;

    const { lat, lon } = coordinates[city];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature`;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const result: OpenMeteoResponse = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message ?? 'Error desconocido.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  return { data, loading, error };
}
