/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, createContext, ReactNode, SetStateAction, Dispatch } from 'react';

export type AuthContextType = {
  auth: AuthType
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
}
export type AuthType = {
  accessToken?: string;
  auth?: AuthType
  setAuth?: Dispatch<SetStateAction<AuthType>>
}
export const AuthContext = createContext<AuthType>({})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthType>({})

  return (
    <AuthContext.Provider value={{ auth, setAuth,  }}>
      {children}
    </AuthContext.Provider>
  );
};
