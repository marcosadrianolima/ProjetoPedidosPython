// arquivo de rotas usando React Router v6, a versão mais recente
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Lazy Loading para otimização (code-splitting)
// Os componentes das páginas foram carregados de forma assíncrona usando React.lazy.
// O Suspense + lazy() dividem o código em chunks separados, melhorando o desempenho.
const LoginForm = lazy(() => import("../pages/LoginForm"));
const Home = lazy(() => import("../pages/Home"));
const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));
const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Componente de fallback para carregamento
const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
  return (
    // O componente Suspense foi adicionado ao redor do Routes para exibir um fallback (<Loading />) enquanto os componentes são carregados.
    // Isso melhora a experiência do usuário, especialmente em aplicações maiores onde o carregamento pode levar mais tempo.
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Redireciona a rota raiz para a página de login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota pública para login */}
        <Route path="/login" element={<LoginForm />} />

        {/* Rotas protegidas com PrivateRoute */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>
        <Route path="/funcionarios" element={<PrivateRoute><FuncionarioList /></PrivateRoute>}/>
        <Route path="/funcionario" element={<PrivateRoute><FuncionarioForm /></PrivateRoute>}/>
        {/* Rota para editar ou visualizar funcionário, com opr {view ou edit} e id dinâmico */}
        <Route path="/funcionario/:opr/:id" element={<PrivateRoute> <FuncionarioForm /> </PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><ClienteList /></PrivateRoute>}/>
        <Route path="/cliente" element={<PrivateRoute><ClienteForm /></PrivateRoute>}/>
        <Route path="/produtos" element={<PrivateRoute><ProdutoList /></PrivateRoute>}/>
        <Route path="/produto" element={<PrivateRoute><ProdutoForm /></PrivateRoute>}/>

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;