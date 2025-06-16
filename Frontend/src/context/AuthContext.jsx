import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {getFuncionarioByCpf} from "../services/funcionarioService";
import bcrypt from 'bcryptjs';

const USUARIO_DEFAULT = import.meta.env.VITE_USUARIO_DEFAULT;
const PASSWORD_DEFAULT = import.meta.env.VITE_PASSWORD_DEFAULT;

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  // Inicializa o estado com base no valor do sessionStorage
  // sessionStorage é um armazenamento temporário que persiste enquanto a aba estiver aberta
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("loginRealizado") === "true";
  });

  // useNavigate é um hook do React Router que permite programaticamente navegar entre rotas
  const navigate = useNavigate();

  // Função para login
  const login = async (username, password) => {
    // Se começar com @, remove o @
    if (username.startsWith('@')) {
      username = username.slice(1);
    
      // Primeiro tenta o login com usuário/senha padrão
      if (username === USUARIO_DEFAULT && password === PASSWORD_DEFAULT) {
        setIsAuthenticated(true);
        sessionStorage.setItem("loginRealizado", "true");
        toast.success("Login realizado com sucesso!");
        navigate("/home");
        return;
      }
    }

    try {
      // Exemplo de chamada assíncrona (ex: fetch para API)
      const existente = await getFuncionarioByCpf(username);
      if(existente == null || existente[0] == null){
        toast.warning("Usuário ou senha inválidos!");
        return;
      }
      var usuarioEncontrado = existente[0];
      
      const senhaConfere = await bcrypt.compare(password, usuarioEncontrado.senha);

      if(usuarioEncontrado.cpf != username || !senhaConfere){
        toast.warning("Usuário ou senha inválidos!");
        return;
      }

      setIsAuthenticated(true);
      sessionStorage.setItem("loginRealizado", "true");
      sessionStorage.setItem("usuarioLigado", JSON.stringify(usuarioEncontrado));
      toast.success("Login realizado com sucesso!");
      navigate("/home");
      return;

    } catch (error) {
      console.error("Erro ao buscar funcionário:", error);
      toast.error("Erro ao tentar realizar o login. Tente novamente.");
    }
  };


  // Função para logout
  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("loginRealizado");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);