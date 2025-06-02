import React, { useEffect, useState } from "react";
// Controller é usado para conectar os campos do formulário ao estado do formulário gerenciado pelo useForm.
// O Controller é um componente que envolve o campo do formulário e fornece as propriedades e métodos necessários para gerenciar o estado do campo.
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import IMaskInputWrapper from "../components/IMaskInputWrapper";
// import dos services de funcionário, faz a comunicação com o backend
import {
  createCliente,
  updateCliente,
  getClienteById,
  getClienteByCpf,
} from "../services/clienteService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from 'bcryptjs';

const ClienteForm = () => {
  
  // O useParams retorna um objeto com os parâmetros da URL, que podem ser acessados pelas chaves correspondentes.
  // O id é o parâmetro da URL que representa o id do cliente a ser editado ou visualizado.
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
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm();

  const [openDialog, setOpenDialog] = useState(false);
  const [cpfExistente, setCpfExistente] = useState(null);
  
  // Se opr for 'view', será utilizada para ajustar o formulário como somente leitura.
  const isReadOnly = opr === "view";
  // title: variável que define o título do formulário com base na operação e no id.
  let title;
  if (opr === "view") {
    title = `Visualizar Cliente: ${id}`;
  } else if (id) {
    title = `Editar Cliente: ${id}`;
  } else {
    title = "Novo Cliente";
  }

  // useEffect: usado para executar efeitos colaterais, como buscar dados do backend ou atualizar o estado do componente.
  // useEffect é um hook que permite executar efeitos colaterais em componentes funcionais.
  // Ele recebe uma função de efeito e um array de dependências como argumentos.
  // A função de efeito é executada após a renderização do componente e
  // pode retornar uma função de limpeza que é executada antes da próxima execução do efeito ou da desmontagem do componente.
  // A dependência id é usada para buscar os dados do cliente a ser editado ou visualizado.
  useEffect(() => {
    if (id) {
      // define uma função assíncrona para buscar os dados do cliente pelo id.
      const fetchCliente = async () => {
        const data = await getClienteById(id);
        // O reset é uma função do react-hook-form que redefine os valores do formulário,
        // no caso, para os valores retornados da consulta.
        reset(data);
      };
      // Chama a função fetchCliente para buscar os dados do cliente.
      fetchCliente();
    }
  }, [id, reset]);

  // onSubmit: função chamada quando o formulário é enviado. Ela recebe os dados do formulário como argumento.
  // A função onSubmit verifica se o id está presente. Se estiver, chama a função updateCliente para atualizar os dados do cliente.
  // Caso contrário, chama a função createCliente para criar um novo cliente.
  // Após a operação, navega para a página de clientes.
  const onSubmit = async (data) => {
    try {
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

      let retorno;
      if (id) {
        retorno = await updateCliente(id, data);
      } else {
        retorno = await createCliente(data);
      }
      // a api, nos casos de sucesso, retorna um objeto com a propriedade id.
      if (!retorno || !retorno.id) {
        // a api, nos casos de erro, retorna um objeto com a propriedade erro.
        throw new Error(retorno.erro || "Erro ao salvar cliente.");
      }
      toast.success(`Cliente salvo com sucesso. ID: ${retorno.id}`, {
        position: "top-center",
      });
      navigate("/clientes");
    } catch (error) {
      toast.error(`Erro ao salvar cliente: \n${error.message}`, {
        position: "top-center",
      });
    }
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
          disabled={isReadOnly}
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

        {/* CPF com máscara */}
        <Controller
          name="cpf"
          control={control}
          defaultValue=""
          rules={{ required: "CPF é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="CPF"
              fullWidth
              margin="normal"
              error={!!errors.cpf}
              helperText={errors.cpf?.message}
              onBlur={async (e) => {
                field.onBlur(); // mantém integração com React Hook Form
                const cpf = e.target.value;
                if (!cpf) return;

                try {
                  const existente = await getClienteByCpf(cpf);

                  // Verifica se existe e se é outro cliente
                  if (
                    existente &&
                    existente[0].id_cliente &&
                    existente[0].id_cliente.toString() !== id
                  ) {
                    setCpfExistente(existente[0]);
                    setOpenDialog(true);
                  }
                } catch (error) {
                  console.error("Erro ao verificar CPF:", error);
                }
              }}
            />
          )}
        />

        <Controller
          name="telefone"
          control={control}
          rules={{ required: 'Telefone é obrigatório' }}
          render={({ field }) => (
            <TextField
              disabled={isReadOnly}
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

       <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                 <Button onClick={() => navigate("/clientes")} sx={{ mr: 1 }}>
                   Cancelar
                 </Button>
                 {opr !== "view" && (
                   <Button type="submit" variant="contained" color="primary">
                     {id ? "Atualizar" : "Cadastrar"}
                   </Button>
                 )}
                 <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                   <DialogTitle>CPF já cadastrado</DialogTitle>
                   <DialogContent>
                     <Typography>
                       Já existe um cliente com o CPF informado. O que deseja
                       fazer?
                     </Typography>
                   </DialogContent>
                   <DialogActions>
                     <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                     <Button
                       onClick={() => {
                         setOpenDialog(false);
                         setTimeout(() => {
                           navigate(`/cliente/view/${cpfExistente?.id_cliente}`);
                         }, 100); // 100ms já costuma ser suficiente
                       }}
                     >
                       Visualizar
                     </Button>
       
                     <Button
                       onClick={() => {
                         setOpenDialog(false);
                         setTimeout(() => {
                           navigate(`/cliente/edit/${cpfExistente?.id_cliente}`);
                         }, 100);
                       }}
                     >
                       Editar
                     </Button>
                   </DialogActions>
                 </Dialog>
               </Box>
      </Box>
    </Box>
  );
};

export default ClienteForm;