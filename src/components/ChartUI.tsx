import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useMemo } from 'react';
import DataFetcher from '../functions/DataFetcher';

interface ChartUIProps {
   selectedCity: string;
}

export default function ChartUI({ selectedCity }: ChartUIProps) {
   const { data, loading, error } = DataFetcher({ city: selectedCity });

   const chartData = useMemo(() => {
      if (!data) return { temperatures: [], windSpeeds: [], timeLabels: [] };
      
      return {
         temperatures: data.hourly.temperature_2m.slice(0, 7),
         windSpeeds: data.hourly.wind_speed_10m.slice(0, 7),
         timeLabels: data.hourly.time.slice(0, 7).map(time => 
            new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
         )
      };
   }, [data]);

   if (loading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return <Alert severity="error">{error}</Alert>;
   }

   return (
      <>
         <Typography variant="h5" component="div">
            Temperatura y Velocidad del Viento
         </Typography>
         <LineChart
            height={300}
            series={[
               { 
                  data: chartData.temperatures,
                  label: 'Temperatura (°C)',
                  curve: "natural"
               },
               { 
                  data: chartData.windSpeeds,
                  label: 'Velocidad del Viento (km/h)',
                  curve: "natural"
               },
            ]}
            xAxis={[{ 
               scaleType: 'point',
               data: chartData.timeLabels,
               tickLabelStyle: {
                  angle: 45,
                  textAnchor: 'start'
               }
            }]}
         />
      </>
   );
}