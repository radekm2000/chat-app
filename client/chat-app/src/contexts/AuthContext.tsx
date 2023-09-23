/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, createContext, ReactNode } from 'react';

interface IAuth {
  accessToken: string
}

export const AuthContext = createContext({
  auth: {},
  setAuth: (auth: IAuth) => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth,  }}>
      {children}
    </AuthContext.Provider>
  );
};
