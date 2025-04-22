import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Container } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import AppRoutes from "./routes/Router";

// toastify para notificações
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    // O BrowserRouter é o roteador principal que gerencia as rotas da aplicação
    <BrowserRouter>
      {/* O AuthProvider envolve toda a aplicação, permitindo que os componentes filhos acessem o contexto de autenticação */}
      <AuthProvider>
          {/* O ToastContainer é o componente que renderiza as notificações na tela */}
          <ToastContainer position="top-center" autoClose={3000} />
        {/* O Navbar é o componente de navegação que contém os links para as diferentes páginas da aplicação */}
        <Navbar />
        {/* O Container é um componente do Material-UI que fornece um layout responsivo e centralizado */}
        <Container sx={{ mt: 4 }}>
        {/* O AppRoutes é o componente que contém as rotas da aplicação, definindo quais componentes devem ser renderizados em cada rota */}
          <AppRoutes />
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;