import React, { useEffect, useState } from "react";
// Controller é usado para conectar os campos do formulário ao estado do formulário gerenciado pelo useForm.
// O Controller é um componente que envolve o campo do formulário e fornece as propriedades e métodos necessários para gerenciar o estado do campo.
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import IMaskInputWrapper from "../components/IMaskInputWrapper";
// import dos services de funcionário, faz a comunicação com o backend
import {
  createFuncionario,
  updateFuncionario,
  getFuncionarioById,
  getFuncionarioByCpf,
} from "../services/funcionarioService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from 'bcryptjs';


const FuncionarioForm = () => {
  // O useParams retorna um objeto com os parâmetros da URL, que podem ser acessados pelas chaves correspondentes.
  // O id é o parâmetro da URL que representa o id do funcionário a ser editado ou visualizado.
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
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [openDialog, setOpenDialog] = useState(false);
  const [cpfExistente, setCpfExistente] = useState(null);
  const [alterarSenha, setAlterarSenha] = useState(false);

  // Se opr for 'view', será utilizada para ajustar o formulário como somente leitura.
  const isReadOnly = opr === "view";
  // title: variável que define o título do formulário com base na operação e no id.
  let title;
  if (opr === "view") {
    title = `Visualizar Funcionário: ${id}`;
  } else if (id) {
    title = `Editar Funcionário: ${id}`;
  } else {
    title = "Novo Funcionário";
  }
  // useEffect: usado para executar efeitos colaterais, como buscar dados do backend ou atualizar o estado do componente.
  // useEffect é um hook que permite executar efeitos colaterais em componentes funcionais.
  // Ele recebe uma função de efeito e um array de dependências como argumentos.
  // A função de efeito é executada após a renderização do componente e
  // pode retornar uma função de limpeza que é executada antes da próxima execução do efeito ou da desmontagem do componente.
  // A dependência id é usada para buscar os dados do funcionário a ser editado ou visualizado.
  useEffect(() => {
    if (id) {
      // define uma função assíncrona para buscar os dados do funcionário pelo id.
      const fetchFuncionario = async () => {
        const data = await getFuncionarioById(id);
        console.log('Senha:'+data.senha)
        // O reset é uma função do react-hook-form que redefine os valores do formulário,
        // no caso, para os valores retornados da consulta.
        reset(data);
      };
      // Chama a função fetchFuncionario para buscar os dados do funcionário.
      fetchFuncionario();
    }
  }, [id, reset]);
  // onSubmit: função chamada quando o formulário é enviado. Ela recebe os dados do formulário como argumento.
  // A função onSubmit verifica se o id está presente. Se estiver, chama a função updateFuncionario para atualizar os dados do funcionário.
  // Caso contrário, chama a função createFuncionario para criar um novo funcionário.
  // Após a operação, navega para a página de funcionários.
  const onSubmit = async (data) => {
    try {
      if (alterarSenha && data.senha) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.senha, salt);
        data.senha = hash;
      }

      let retorno;
      if (id) {
        retorno = await updateFuncionario(id, data);
      } else {
        retorno = await createFuncionario(data);
      }
      // a api, nos casos de sucesso, retorna um objeto com a propriedade id.
      if (!retorno || !retorno.id) {
        // a api, nos casos de erro, retorna um objeto com a propriedade erro.
        throw new Error(retorno.erro || "Erro ao salvar funcionário.");
      }
      toast.success(`Funcionário salvo com sucesso. ID: ${retorno.id}`, {
        position: "top-center",
      });
      navigate("/funcionarios");
    } catch (error) {
      toast.error(`Erro ao salvar funcionário: \n${error.message}`, {
        position: "top-center",
      });
    }
  };
  return (
    // O Box é um componente do Material-UI que pode ser usado como um contêiner flexível para outros componentes.
    // O component="form" indica que o Box deve ser tratado como um elemento de formulário HTML.
    // O onSubmit é uma função que será chamada quando o formulário for enviado.
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ backgroundColor: "#ADD8E6", padding: 2, borderRadius: 1, mt: 2 }}
    >
      <Toolbar
        sx={{
          backgroundColor: "#ADD8E6",
          padding: 1,
          borderRadius: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
      </Toolbar>
      <Box
        sx={{ backgroundColor: "white", padding: 2, borderRadius: 3, mb: 2 }}
      >
        {opr === "view" && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Todos os campos estão em modo somente leitura.
          </Typography>
        )}
        <Controller
          name="nome"
          control={control}
          defaultValue=""
          rules={{ required: "Nome é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isReadOnly}
              label="Nome"
              fullWidth
              margin="normal"
              error={!!errors.nome}
              helperText={errors.nome?.message}
            />
          )}
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
                  const existente = await getFuncionarioByCpf(cpf);

                  // Verifica se existe e se é outro funcionário
                  if (
                    existente &&
                    existente[0].id_funcionario &&
                    existente[0].id_funcionario.toString() !== id
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
          name="matricula"
          control={control}
          defaultValue=""
          rules={{ required: "Matrícula é obrigatória" }}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isReadOnly}
              label="Matrícula"
              fullWidth
              margin="normal"
              error={!!errors.matricula}
              helperText={errors.matricula?.message}
            />
          )}
        />
        {/* Telefone com máscara */}
        <Controller
          name="telefone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isReadOnly}
              label="Telefone"
              fullWidth
              margin="normal"
              error={!!errors.telefone}
              helperText={errors.telefone?.message}
              InputProps={{
                // Define o IMaskInputWrapper como o componente de entrada
                inputComponent: IMaskInputWrapper,
                inputProps: {
                  mask: "(00) 00000.0000",
                  // O regex [0-9] ou \d aceita apenas números de 0 a 9
                  definitions: {
                    0: /\d/,
                  },
                  // Retorna apenas os números no valor
                  unmask: true,
                },
              }}
            />
          )}
        />
        
        {!isReadOnly && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Deseja alterar a senha?</InputLabel>
              <Select
                value={alterarSenha ? "sim" : "nao"}
                onChange={(e) => setAlterarSenha(e.target.value === "sim")}
              >
                <MenuItem value="nao">Não</MenuItem>
                <MenuItem value="sim">Sim</MenuItem>
              </Select>
            </FormControl>

            {alterarSenha && (
              <Controller
                name="senha"
                control={control}
                defaultValue=""
                rules={{
                  required: "Senha obrigatória",
                  minLength: { value: 6, message: "Pelo menos 6 caracteres" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    disabled={isReadOnly}
                    label="Nova Senha"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={!!errors.senha}
                    helperText={errors.senha?.message}
                  />
                )}
              />
            )}
          </>
        )}
        <Controller
          name="grupo"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel id="grupo-label">Grupo</InputLabel>
              <Select
                {...field}
                disabled={isReadOnly}
                label="Grupo"
                labelId="grupo-label"
              >
                <MenuItem value="1">Admin</MenuItem>
                <MenuItem value="2">Atendimento Balcão</MenuItem>
                <MenuItem value="3">Atendimento Caixa</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => navigate("/funcionarios")} sx={{ mr: 1 }}>
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
                Já existe um funcionário com o CPF informado. O que deseja
                fazer?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                  setTimeout(() => {
                    navigate(`/funcionario/view/${cpfExistente?.id_funcionario}`);
                  }, 100); // 100ms já costuma ser suficiente
                }}
              >
                Visualizar
              </Button>

              <Button
                onClick={() => {
                  setOpenDialog(false);
                  setTimeout(() => {
                    navigate(`/funcionario/edit/${cpfExistente?.id_funcionario}`);
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
export default FuncionarioForm;
