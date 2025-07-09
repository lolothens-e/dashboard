import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select , { type SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

interface SelectorUIProps {
  onCityChange?: (value: string) => void; 
}

export default function SelectorUI({ onCityChange }: SelectorUIProps) {

  const [cityInput, setCityInput] = useState('');
  
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedCity = event.target.value;
    setCityInput(selectedCity);
    
    if (onCityChange){
      onCityChange(selectedCity);
    }
        
  };


return (
   <FormControl fullWidth>
      <InputLabel id="city-select-label">Ciudad</InputLabel>
      <Select
         labelId="city-select-label"
         id="city-simple-select"
         onChange={handleChange}
         value={cityInput}
         label="Ciudad">
         <MenuItem disabled><em>Seleccione una ciudad</em></MenuItem>
         <MenuItem value={"guayaquil"}>Guayaquil</MenuItem>
         <MenuItem value={"quito"}>Quito</MenuItem>
         <MenuItem value={"manta"}>Manta</MenuItem>
         <MenuItem value={"cuenca"}>Cuenca</MenuItem>
      </Select>
      {cityInput && (
            <p>
                Información del clima en <span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{cityInput}</span>
            </p>
        )}

   </FormControl>
   )
}