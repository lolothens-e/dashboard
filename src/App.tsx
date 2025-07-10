import { Grid } from '@mui/material';
import { useState } from 'react';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';

function App() {
  const [selectedCity, setSelectedCity] = useState('guayaquil');
  const dataFetcherOutput = DataFetcher({ city: selectedCity });

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">
      <Grid size={{ xs: 12, md: 12 }}>
        <HeaderUI />
      </Grid>

      <Grid container justifyContent="right" alignItems="center">
        <AlertUI description="No se preveen lluvias" />
      </Grid>

      <Grid size={{ xs: 12, md: 3  }}>
        <SelectorUI onCityChange={setSelectedCity} />
      </Grid>

      <Grid container size={{ xs: 12, md: 9 }}>
        {dataFetcherOutput.loading && <p>Cargando datos...</p>}
        {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
        {dataFetcherOutput.data && (
          <>
            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title="Temperatura (2m)"
                description={
                  dataFetcherOutput.data.current.temperature_2m +
                  ' ' +
                  dataFetcherOutput.data.current_units.temperature_2m
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title="Temperatura aparente"
                description={
                  dataFetcherOutput.data.current.apparent_temperature +
                  ' ' +
                  dataFetcherOutput.data.current_units.apparent_temperature
                }
              />
            </Grid>
            <Grid  size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title="Velocidad del viento"
                description={
                  dataFetcherOutput.data.current.wind_speed_10m +
                  ' ' +
                  dataFetcherOutput.data.current_units.wind_speed_10m
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title="Humedad relativa"
                description={
                  dataFetcherOutput.data.current.relative_humidity_2m +
                  ' ' +
                  dataFetcherOutput.data.current_units.relative_humidity_2m
                }
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid sx={{ display: { xs: 'none', md: 'block' } }}>
        <ChartUI />
      </Grid>

      <Grid sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableUI />
      </Grid>

      <Grid>Elemento: Información adicional</Grid>
    </Grid>
  );
}

export default App;
