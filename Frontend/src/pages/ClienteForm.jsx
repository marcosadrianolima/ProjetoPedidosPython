import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  Toolbar
} from '@mui/material';
import { toast } from 'react-toastify';
import IMaskInputWrapper from '../components/IMaskInputWrapper';

const ClienteForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    const cpfNumeros = data.cpf?.replace(/\D/g, '');
    const telNumeros = data.telefone?.replace(/\D/g, '');

    if (cpfNumeros.length !== 11) {
      toast.error('CPF deve conter exatamente 11 números.');
      return;
    }

    if (telNumeros.length !== 10 && telNumeros.length !== 11) {
      toast.error('Telefone deve ter 10 ou 11 números.');
      return;
    }

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
          {...register('nome', {
            required: 'Nome é obrigatório',
            maxLength: { value: 100, message: 'Máximo de 100 caracteres' }
          })}
          error={!!errors.nome}
          helperText={errors.nome?.message}
        />

        <Controller
          name="cpf"
          control={control}
          rules={{ required: 'CPF é obrigatório' }}
          render={({ field }) => (
            <TextField
              label="CPF"
              fullWidth
              margin="normal"
              InputProps={{
                inputComponent: IMaskInputWrapper,
                inputProps: {
                  mask: '000.000.000-00',
                  overwrite: true,
                }
              }}
              {...field}
              error={!!errors.cpf}
              helperText={errors.cpf?.message}
            />
          )}
        />

        <Controller
          name="telefone"
          control={control}
          rules={{ required: 'Telefone é obrigatório' }}
          render={({ field }) => (
            <TextField
              label="Telefone"
              fullWidth
              margin="normal"
              InputProps={{
                inputComponent: IMaskInputWrapper,
                inputProps: {
                  mask: [
                    { mask: '(00) 0000-0000' },
                    { mask: '(00) 0 0000-0000' }
                  ],
                  overwrite: true
                }
              }}
              {...field}
              error={!!errors.telefone}
              helperText={errors.telefone?.message}
            />
          )}
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