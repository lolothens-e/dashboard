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

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutos

export default function DataFetcher({ city }: Props): DataFetcherOutput {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;

    const { lat, lon } = coordinates[city];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature`;
    const storageKey = `weather-${city}`;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verificar si hay datos en localStorage y si están vigentes
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION_MS) {
            setData(data);
            setLoading(false);
            return;
          }
        }

        // Si no hay datos válidos, hacer la petición
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const result: OpenMeteoResponse = await response.json();
        setData(result);

        // Guardar en localStorage
        localStorage.setItem(storageKey, JSON.stringify({
          timestamp: Date.now(),
          data: result,
        }));
      } catch (err: any) {
        // Si hay error y datos cacheados viejos, usarlos como respaldo
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const { data } = JSON.parse(cached);
          setData(data);
          setError('Error en la red. Mostrando datos guardados.');
        } else {
          setError(err.message ?? 'Error desconocido.');
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  return { data, loading, error };
}
