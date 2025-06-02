import React, { useEffect, useState } from 'react';
// Controller é usado para conectar os campos do formulário ao estado do formulário gerenciado pelo useForm.
// O Controller é um componente que envolve o campo do formulário e fornece as propriedades e métodos necessários para gerenciar o estado do campo.
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar, } from '@mui/material';
// import dos services, faz a comunicação com o backend
import { createProduto, updateProduto, getProdutoById } from '../services/produtoService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
// redimensionar e comprimir imagens no navegador
// um campo blob aceita arquivos binários, como imagens, vídeos e outros tipos de dados.
// o limite de blob em mysql é 64 KB
import imageCompression from 'browser-image-compression';
const ProdutoForm = () => {
  // O useParams retorna um objeto com os parâmetros da URL, que podem ser acessados pelas chaves correspondentes.
  // O id é o parâmetro da URL que representa o id a ser editado ou visualizado.
  // O opr é o parâmetro da URL que representa a operação a ser realizada (edit ou view).
  const { id, opr } = useParams();
  // useNavigate é usado para navegar entre páginas.
  const navigate = useNavigate();
  // useForm: usado para gerenciar o estado do formulário, como os valores dos campos e as validações.
  // O useForm retorna um objeto com várias propriedades e métodos, como control, handleSubmit, reset e formState.
  // control: usado para conectar os campos do formulário ao estado do formulário gerenciado pelo useForm.
  // handleSubmit: função que lida com o envio do formulário e valida os dados.
  // reset: função que redefine os valores do formulário para os valores iniciais.
  // formState: objeto que contém o estado do formulário, como erros de validação e se o formulário está sendo enviado.
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  // Se opr for 'view', será utilizada para ajustar o formulário como somente leitura.
  const isReadOnly = opr === 'view';
  // title: variável que define o título do formulário com base na operação e no id.
  let title;
  if (opr === 'view') {
    title = `Visualizar Produto: ${id}`;
  } else if (id) {
    title = `Editar Produto: ${id}`;
  } else {
    title = "Novo Produto";
  }


  // Estado para armazenar a foto selecionada e sua pré-visualização
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  // Função para lidar com a seleção de arquivo.
  // É chamada na função onchange do input file.
  // Após redidensionar a imagem, alterando o estado da foto e a pré-visualização.
  const handleFileChange = async (event) => {
    // Verifica se um arquivo foi selecionado
    // O event.target.files é uma lista de arquivos selecionados pelo usuário.
    const file = event.target.files[0];
    if (file) {
      try {
        // Configurações para redimensionar e comprimir a imagem
        const options = {
          maxSizeMB: 1, // Tamanho máximo do arquivo em MB
          maxWidthOrHeight: 100, // Largura ou altura máxima em pixels
          useWebWorker: true, // Usa Web Workers para melhorar a performance
        };
        // Redimensiona e comprime a imagem
        const compressedFile = await imageCompression(file, options);
        // Atualiza o estado com a imagem redimensionada
        setFoto(compressedFile);
        // Gera a URL para pré-visualização
        const previewUrl = URL.createObjectURL(compressedFile);
        setFotoPreview(previewUrl);
      } catch (error) {
        console.error("Erro ao redimensionar a imagem:", error);
        toast.error("Erro ao redimensionar a imagem.");
      }
    } else {
      setFoto(null);
      setFotoPreview(null);
    }

  };

  useEffect(() => {
    if (id) {
      // define uma função assíncrona para buscar os dados pelo id.
      const fetchProduto = async () => {
        const data = await getProdutoById(id);
        // O reset é uma função do react-hook-form que redefine os valores do formulário, no caso, para os valores retornados da consulta.
        reset(data);
        // Se o produto já tiver uma foto, configurar a pré-visualização inicial
        if (data.foto) {
          setFoto(data.foto); // Define a foto existente no estado
          setFotoPreview(data.foto); // define a pré-visualização da foto
        }
      };
      // Chama a função fetchProduto para buscar os dados.
      fetchProduto();
    }
  }, [id, reset]);
  const onSubmit = async (data) => {
    try {
      // Verifica se uma nova foto foi selecionada
      if (!foto && id) {
        // Se não houver uma nova foto, mantém a foto existente. Envia o conteúdo em base64 já existente no banco de dados
        const produto = await getProdutoById(id);
        data.foto = produto.foto;
      } else if (foto) {
        // Se uma nova foto foi selecionada, adiciona ao objeto de dados
        data.foto = foto;
      }
      let retorno;
      if (id) {
        retorno = await updateProduto(id, data);
      } else {
        retorno = await createProduto(data);
      }
      // a api, nos casos de sucesso, retorna um objeto com a propriedade id.
      if (!retorno?.id) {
        // a api, nos casos de erro, retorna um objeto com a propriedade erro.
        throw new Error(retorno.erro || "Erro ao salvar produto.");
      }
      toast.success(`Produto salvo com sucesso. ID: ${retorno.id}`, { position: "top-center" });
      navigate('/produtos');
    } catch (error) {
      toast.error(`Erro ao salvar produto: \n${error.message}`, { position: "top-center" });
    }

  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>
      <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom color="primary">{title}</Typography>
      </Toolbar>
      <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
        {opr === 'view' && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Todos os campos estão em modo somente leitura.
          </Typography>
        )}
        <Controller
          name="nome"
          control={control}
          defaultValue=""
          rules={{ required: "Nome é obrigatório", maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" } }}
          render={({ field }) => (
            <TextField {...field} disabled={isReadOnly} label="Nome" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
          )}
        />
        <Controller
          name="descricao"
          control={control}
          defaultValue=""
          rules={{ required: "Descrição é obrigatória", maxLength: { value: 200, message: "Descrição deve ter no máximo 200 caracteres" } }}
          render={({ field }) => (
            <TextField {...field} disabled={isReadOnly} label="Descrição" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
          )}
        />
        <Controller
          name="valor_unitario"
          control={control}
          defaultValue=""
          rules={{ required: "Valor é obrigatório", maxLength: { value: 100, message: "Valor deve ter no máximo 100 caracteres" } }}
          render={({ field }) => (
            <TextField {...field} type="number" disabled={isReadOnly} label="Valor" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
          )}

        />
        {/* Campo para selecionar a foto */}
        {/* O input file é um campo de entrada que permite ao usuário selecionar um arquivo do sistema de arquivos. */}
        {/* O accept é usado para especificar os tipos de arquivos que o usuário pode selecionar. */}
        {/* O disabled é usado para desabilitar o campo quando o formulário está em modo somente leitura. */}
        {/* O onChange é um evento que é acionado quando o valor do campo muda. */}
        {/* O handleFileChange é uma função que lida com a mudança do valor do campo, redimensionando e comprimindo a imagem selecionada. */}
        {/* Não utilizamos Controller, pois o estado será tratado em handleFileChange */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom color='primary'>Foto do Produto:</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isReadOnly}
            style={{ marginTop: '8px' }}
          />
        </Box>
        {/* Pré-visualização da foto */}
        {fotoPreview && (
          <Box sx={{ mt: 2 }}>
            <img src={fotoPreview} alt="Pré-visualização" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => navigate('/produtos')} sx={{ mr: 1 }}>Cancelar</Button>
          {opr !== 'view' && (
            <Button type="submit" variant="contained" color="primary">{id ? "Atualizar" : "Cadastrar"}</Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProdutoForm;