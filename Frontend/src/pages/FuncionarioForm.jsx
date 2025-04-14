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

const FuncionarioForm = () => {
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log("Dados do funcionário:", data);
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
          Dados Funcionário
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
            label="Matrícula"
            fullWidth
            margin="normal"
            {...register('matricula', { required: 'Matrícula é obrigatória' })}
            error={!!errors.matricula}
            helperText={errors.matricula?.message}
            />

            <TextField
            label="Telefone"
            fullWidth
            margin="normal"
            {...register('telefone')}
            />

            <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: {
                value: 6,
                message: 'Senha deve ter pelo menos 6 caracteres'
                }
            })}
            error={!!errors.senha}
            helperText={errors.senha?.message}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="grupo-label">Grupo</InputLabel>
              <Select
                  labelId="grupo-label"
                  label="Grupo"
                  defaultValue=""
                  {...register('grupo')}
              >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="gerente">Gerente</MenuItem>
                  <MenuItem value="funcionario">Funcionário</MenuItem>
              </Select>
            </FormControl>

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

export default FuncionarioForm;