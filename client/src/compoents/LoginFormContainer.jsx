import { Grid } from '@mui/material';

const FormContainer = ({ children }) => {
  return (
    <Grid 
      container 
      direction="column" 
      justifyContent="center" 
      alignItems="center" 
      spacing={2}
    >
      {children}
    </Grid>
  );
};

export default FormContainer;
