import { toast } from "react-toastify";
import { useForm, Controller } from 'react-hook-form';
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

// import do IMaskInputWrapper, que é o wrapper do IMaskInput
import IMaskInputWrapper from '../components/IMaskInputWrapper';

const FuncionarioForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    const { cpf, telefone, matricula, senha, nome, grupo } = data;

    // Validando CPF (padrão: 000.000.000-00) e verificando se são 11 números
    const cpfWithoutMask = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    
    if (cpfWithoutMask.length !== 11) {
      toast.error("CPF deve ter 11 números.");
      return;
    }

    // Validando telefone (padrão: (xx) x xxxx-xxxx ou (xx) xxxx-xxxx)
    const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
      toast.error("Telefone inválido. O formato deve ser (xx) x xxxx-xxxx ou (xx) xxxx-xxxx.");
      return;
    }

    // Validando a matrícula (máximo de 10 caracteres numéricos)
    if (matricula.length > 10) {
      toast.error("Matrícula não pode ter mais de 10 caracteres.");
      return;
    }

    // Validando senha (mínimo de 6 caracteres)
    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Validando se o grupo foi selecionado
    if (!grupo) {
      toast.error("Selecione um grupo.");
      return;
    }

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
          {...register('nome', { required: 'Nome é obrigatório', maxLength: { value: 100, message: 'Nome deve ter no máximo 100 caracteres' } })}
          error={!!errors.nome}
          helperText={errors.nome?.message}
        />

        <Controller
          name="cpf"
          control={control}
          rules={{ required: "CPF é obrigatório" }}
          render={({ field }) => (
            <TextField
              label="CPF"
              fullWidth
              margin="normal"
              InputProps={{
                inputComponent: IMaskInputWrapper,
                inputProps: {
                  mask: "000.000.000-00",
                  overwrite: true,
                },
              }}
              {...field}
              error={!!errors.cpf}
              helperText={errors.cpf?.message}
            />
          )}
        />

        <TextField
          label="Matrícula"
          fullWidth
          margin="normal"
          {...register('matricula', { 
            required: 'Matrícula é obrigatória',
            maxLength: { value: 10, message: 'Matrícula não pode ter mais de 10 caracteres' }
          })}
          error={!!errors.matricula}
          helperText={errors.matricula?.message}
        />

        <Controller
          name="telefone"
          control={control}
          rules={{
            required: "Telefone é obrigatório",
            validate: (value) => {
              const onlyNumbers = value.replace(/\D/g, '');
              return onlyNumbers.length >= 10 && onlyNumbers.length <= 11 || "Telefone inválido";
            }
          }}
          render={({ field }) => (
            <TextField
              label="Telefone"
              fullWidth
              margin="normal"
              InputProps={{
                inputComponent: IMaskInputWrapper,
                inputProps: {
                  mask: [
                    { mask: "(00) 0000-0000" },
                    { mask: "(00) 0 0000-0000" }
                  ],
                  overwrite: true,
                }
              }}
              {...field}
              error={!!errors.telefone}
              helperText={errors.telefone?.message}
            />
          )}
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
            },
            maxLength: { value: 200, message: 'Senha não pode ter mais de 200 caracteres' }
          })}
          error={!!errors.senha}
          helperText={errors.senha?.message}
        />

        <Controller
          name="grupo"
          control={control}
          rules={{ required: 'Grupo é obrigatório' }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.grupo}>
              <InputLabel id="grupo-label">Grupo</InputLabel>
              <Select
                {...field}
                labelId="grupo-label"
                label="Grupo"
                defaultValue=""
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="gerente">Gerente</MenuItem>
                <MenuItem value="funcionario">Funcionário</MenuItem>
              </Select>
              {errors.grupo && (
                <Typography variant="caption" color="error">
                  {errors.grupo.message}
                </Typography>
              )}
            </FormControl>
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

export default FuncionarioForm;