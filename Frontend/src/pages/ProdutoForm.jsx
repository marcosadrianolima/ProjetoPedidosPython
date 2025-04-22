import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  Toolbar
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import React, { useState, forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { toast } from "react-toastify";

const ProdutoForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [selectedFileName, setSelectedFileName] = useState("");

  const onSubmit = (data) => {
    console.log("Dados do produto:", data);
    toast.success("Produto cadastrado com sucesso!");
  };
  const CurrencyInput = forwardRef(function CurrencyInput(props, ref) {
    const { onChange, ...other } = props;
  
    return (
      <IMaskInput
        {...other}
        mask="R$ num"
        blocks={{
          num: {
            mask: Number,
            thousandsSeparator: ".",
            radix: ",",
            mapToRadix: [".", ","],
            scale: 2,
            padFractionalZeros: true,
            normalizeZeros: true,
            min: 0,
          },
        }}
        inputRef={ref}
        onAccept={(value) => onChange(value)}
        overwrite
      />
    );
  });

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
          {...register('nome', {
            required: 'Nome é obrigatório',
            maxLength: { value: 100, message: 'Nome deve ter no máximo 100 caracteres' }
          })}
          error={!!errors.nome}
          helperText={errors.nome?.message}
        />

        <TextField
          label="Descrição"
          fullWidth
          margin="normal"
          {...register('descricao', {
            required: 'Descrição é obrigatória',
            minLength: { value: 6, message: 'Descrição deve ter no mínimo 6 caracteres' },
            maxLength: { value: 100, message: 'Descrição deve ter no máximo 100 caracteres' }
          })}
          error={!!errors.descricao}
          helperText={errors.descricao?.message}
        />

        <Controller
          name="valor_unitario"
          control={control}
          rules={{ required: "Valor unitário é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Valor Unitário"
              fullWidth
              margin="normal"
              InputProps={{
                inputComponent: CurrencyInput,
              }}
              error={!!errors.valor_unitario}
              helperText={errors.valor_unitario?.message}
            />
          )}
        />

        {/* Campo de upload de imagem */}
        <Controller
          name="imagem"
          control={control}
          rules={{
            required: "Imagem é obrigatória",
            validate: {
              isImage: (value) => {
                const file = value?.[0];
                if (!file) return "Imagem é obrigatória";

                const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
                return allowedTypes.includes(file.type) || "Formato inválido. Use PNG, JPG, JPEG ou GIF";
              }
            }
          }}
          render={({ field: { onChange, ref }, fieldState: { error } }) => (
            <>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                id="upload-image"
                style={{ display: "none" }}
                onChange={(e) => {
                  onChange(e.target.files); // envia para o form
                  setSelectedFileName(e.target.files[0]?.name || "");
                }}
                ref={ref}
              />

              <label htmlFor="upload-image">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadFileIcon />}
                >
                  Selecionar Imagem
                </Button>
              </label>

              {selectedFileName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Arquivo selecionado: <strong>{selectedFileName}</strong>
                </Typography>
              )}

              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {error.message}
                </Typography>
              )}
            </>
          )}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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