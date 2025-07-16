import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useMemo } from 'react';
import DataFetcher from '../functions/DataFetcher';

interface TableUIProps {
   selectedCity: string;
}

function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
   return arrLabels.map((label, index) => ({
      id: index,
      label: label,
      value1: arrValues1[index],
      value2: arrValues2[index]
   }));
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 90 },
   {
      field: 'label',
      headerName: 'Label',
      width: 150,
   },
   {
      field: 'value1',
      headerName: 'Value 1',
      width: 150,
   },
   {
      field: 'value2',
      headerName: 'Value 2',
      width: 150,
   },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 160,
      valueGetter: (_, row) => `${row.label || ''} ${row.value1 || ''} ${row.value2 || ''}`,
   },
];

export default function TableUI({ selectedCity }: TableUIProps) {
   const { data, loading, error } = DataFetcher({ city: selectedCity });

   const rows = useMemo(() => {
      if (!data) return [];
      
      const temperatures = data.hourly.temperature_2m.slice(0, 7);
      const windSpeeds = data.hourly.wind_speed_10m.slice(0, 7);
      const timeLabels = data.hourly.time.slice(0, 7).map(time => 
         new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      );
      
      return combineArrays(timeLabels, temperatures, windSpeeds);
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
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}