// useEffect: usado para executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
// useState: usado para gerenciar o estado local do componente, como a lista.
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery, }
  from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
// useNavigate: usado para navegar entre páginas.
import { useNavigate } from 'react-router-dom';
// serviços - funções para buscar e deletar
import { getClientes, deleteCliente } from '../services/clienteService';
// mensagens de sucesso, erro e confirmação
import { toast } from 'react-toastify';
// useTheme: usado para acessar o tema do Material-UI.
import { useTheme } from '@mui/material/styles';

function ClienteList() {
  const navigate = useNavigate();

  // Hook para detectar o tamanho da tela
    // theme: Obtém o tema do Material-UI.
    const theme = useTheme();
    // Aqui, estamos verificando se a tela é menor ou igual ao breakpoint 'sm' definido no tema
    // O valor 'sm' é definido no tema do Material-UI e representa um breakpoint específico (geralmente 600px)
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    // useMediaQuery: Usado para verificar o tamanho da tela e ajustar a interface.
    // useState: usado para gerenciar o estado local do componente, como a lista.
    // Aqui, estamos criando um estado chamado clientes e uma função para atualizá-lo chamada setclientes.
    // O estado inicial é um array vazio, que será preenchido com os dados dos retornados após a chamada da API / Proxy/BFF.
    const [clientes, setClientes] = useState([]);

    // useEffect: usado para executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
    // O array vazio [] significa que o efeito será executado apenas uma vez, quando o componente for montado.
    useEffect(() => {
      fetchClientes();
    }, []);

    // getClientes: função que faz a chamada à API / Proxy/BFF para buscar os dados.
    const fetchClientes = async () => {
      try {
        const data = await getClientes();
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    // handleDeleteClick: função que exibe um toast de confirmação antes de excluir.
    const handleDeleteClick = (cliente) => {
      toast(
        <div>
          <Typography>Tem certeza que deseja excluir o cliente <strong>{cliente.nome}</strong>?</Typography>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained" color="error" size="small"
              onClick={() => handleDeleteConfirm(cliente.id_cliente)} style={{ marginRight: '10px' }}
            >Excluir</Button>
            <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
          </div>
        </div>,
        {
          position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false,
        }
      );
    };
    
    const handleDeleteConfirm = async (id) => {
        try {
          await deleteCliente(id);
          fetchClientes();
          toast.dismiss(); // Fecha o toast após a exclusão
          toast.success('Cliente excluído com sucesso!', { position: "top-center" });
        } catch (error) {
          console.error('Erro ao deletar cliente:', error);
          toast.error('Erro ao excluir cliente.', { position: "top-center" });
        }
      };

  return (
    <TableContainer component={Paper}>
      <Toolbar
        sx={{
          backgroundColor: '#ADD8E6',
          padding: 2,
          borderRadius: 1,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6" color="primary">
          CLientes
        </Typography>
        <Button
          color="primary"
          onClick={() => navigate('/cliente')}
          startIcon={<FiberNew />}
        >
          Novo
        </Button>
      </Toolbar>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((cliente) => (
                      <TableRow key={cliente.id_cliente}>
                        <TableCell>{cliente.id_cliente}</TableCell>
                        <TableCell>{cliente.nome}</TableCell>
                        <TableCell>{cliente.cpf}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => navigate(`/cliente/view/${cliente.id_cliente}`)}
                          >
                            <Visibility color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={() => navigate(`/cliente/edit/${cliente.id_cliente}`)}
                          >
                            <Edit color="secondary" />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(cliente)}>
                            <Delete color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ClienteList;