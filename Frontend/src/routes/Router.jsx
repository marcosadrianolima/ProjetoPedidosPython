import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy Loading para otimização (code-splitting) - Os componentes das páginas são carregados de forma assíncrona.
const LoginForm = lazy(() => import("../pages/LoginForm"));
const Home = lazy(() => import("../pages/Home"));
const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));
const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Loader para o Suspense - Melhora a experiência do usuário em aplicações maiores.
const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
  return (
    // Suspense exibe o fallback (<Loading />) enquanto os componentes lazy são carregados.
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/funcionarios" element={<FuncionarioList />} />
        <Route path="/funcionario" element={<FuncionarioForm />} />
        <Route path="/clientes" element={<ClienteList />} />
        <Route path="/cliente" element={<ClienteForm />} />
        <Route path="/produtos" element={<ProdutoList />} />
        <Route path="/produto" element={<ProdutoForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;