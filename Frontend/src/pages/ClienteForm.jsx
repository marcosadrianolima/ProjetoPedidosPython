import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Toolbar
} from '@mui/material';

const ClienteForm = () => {
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log("Dados do cliente:", data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}
    >
      <Toolbar
        sx={{
          backgroundColor: '#ADD8E6',
          padding: 1,
          borderRadius: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6" color="primary">
          Dados Cliente
        </Typography>
      </Toolbar>

      <Box
        sx={{
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 3,
          mb: 2
        }}
      >
        <TextField
            label="Nome"
            fullWidth
            margin="normal"
            {...register('nome', { required: 'Nome é obrigatório' })}
            error={!!errors.nome}
            helperText={errors.nome?.message}
            />

            <TextField
            label="CPF"
            fullWidth
            margin="normal"
            {...register('cpf', { required: 'CPF é obrigatório' })}
            error={!!errors.cpf}
            helperText={errors.cpf?.message}
            />

            <TextField
            label="Telefone"
            fullWidth
            margin="normal"
            {...register('telefone')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button sx={{ mr: 1 }} variant="outlined" color="secondary">
                Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
                Cadastrar
            </Button>
            </Box>

      </Box>
    </Box>
  );
};

export default ClienteForm;