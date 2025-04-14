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
  Toolbar,
  Input
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import React, { useState } from "react";

const ProdutoForm = () => {
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors }
  } = useForm();

  const [selectedFileName, setSelectedFileName] = useState("");

  const onSubmit = (data) => {
    console.log("Dados do produto:", data);
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
          Dados Produto
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
        label="Descrição"
        fullWidth
        margin="normal"
        {...register('descricao', { required: 'Descrição é obrigatório' })}
        error={!!errors.descricao}
        helperText={errors.descricao?.message}
        />

      <TextField
        label="Valor Unitário"
        fullWidth
        margin="normal"
        {...register('valor_unitario', { required: 'Valor unitário é obrigatório' })}
        error={!!errors.valor_unitario}
        helperText={errors.valor_unitario?.message}
        />

      <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            backgroundColor: "#fff",
            padding: 3,
            borderRadius: 2,
            boxShadow: 2,
            mt: 3,
          }}
        >
          {/* Input invisível */}
          <input
            type="file"
            accept="image/*"
            id="upload-image"
            style={{ display: "none" }}
            {...register("imagem", {
              required: "Imagem é obrigatória",
              onChange: (e) => setSelectedFileName(e.target.files[0]?.name || "")
            })}
          />

          {/* Botão estilizado */}
          <label htmlFor="upload-image">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadFileIcon />}
            >
              Selecionar Imagem
            </Button>
          </label>

          {/* Nome do arquivo */}
          {selectedFileName && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Arquivo selecionado: <strong>{selectedFileName}</strong>
            </Typography>
          )}

          {/* Mensagem de erro */}
          {errors.imagem && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errors.imagem.message}
            </Typography>
          )}
      </Box>
        

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

export default ProdutoForm;