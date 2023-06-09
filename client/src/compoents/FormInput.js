import { TextField, FormControl } from '@mui/material';

const FormInput = ({ label, value, type = 'text', onChange }) => {
  return (
    <FormControl fullWidth margin="normal">
      <TextField label={label} value={value} onChange={onChange} type={type} />
    </FormControl>
  );
};

export default FormInput;
