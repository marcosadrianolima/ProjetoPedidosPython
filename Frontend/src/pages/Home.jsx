import React from "react";
import { Box, Typography, Toolbar } from "@mui/material";

export const obterGrupo = (grupo) => {
  
  switch (grupo) {
    case 1:
      return "Admin";
    case 2:
      return "Balcão";
    case 3:
      return "Caixa";
    default:
      return "Usuário não mapeado";
  }
};

const Home = () => {
  
  const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLigado"));
  
  const obterGrupo = (usuario) => {
    if (!usuario || usuario.grupo == null) return "Usuário não mapeado";

    switch (usuario.grupo) {
      case 1:
        return "Admin";
      case 2:
        return "Balcão";
      case 3:
        return "Caixa";
      default:
        return "Usuário não mapeado";
    }
  };

  const grupo = obterGrupo(usuarioLogado);
  
  return (
    <Box
      sx={{
        backgroundColor: '#ADD8E6',
        padding: 1,
        borderRadius: 1,
        mt: 2
      }}
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
          Home
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
        <Typography variant="body1" color="textPrimary">
          Bem-vindo ao aplicativo Comandas <b>{usuarioLogado.nome}</b>!
        </Typography>
        <Typography variant="body1" color="textPrimary">
          Grupo <b>{grupo}</b>!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Explore as funcionalidades e aproveite sua experiência.
        </Typography>
        <Typography variant="body1" color="textDisabled">
          {`Data atual: ${new Date().toLocaleDateString()}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;