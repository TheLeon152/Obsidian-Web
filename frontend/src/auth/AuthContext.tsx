import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  clearTokens,
  getAccessToken,
  setTokens,
} from "../api/client";

import {
  login as loginRequest,
} from "../api/auth";

import type {
  LoginRequest,
} from "../types/auth";


interface AuthContextValue {
  isAuthenticated: boolean;

  login: (
    credentials: LoginRequest
  ) => Promise<void>;

  logout: () => void;
}


const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(
    () => {
      return getAccessToken() !== null;
    },
  );


  async function login(
    credentials: LoginRequest,
  ) {
    const tokens =
      await loginRequest(
        credentials,
      );
    setTokens(
      tokens.access_token,
      tokens.refresh_token,
    );

    setIsAuthenticated(true);
  }


  function logout() {

    clearTokens();

    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  const context =
    useContext(AuthContext);


  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }


  return context;
}