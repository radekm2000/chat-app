import { ReactNode, createContext, useState } from "react";

const defaultState = {
  meUser: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (meUser: string) => {},
} as UserContext;

type UserContext = {
  meUser: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
};
export const UserContext = createContext<UserContext>(defaultState);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [meUser, setUser] = useState<string>("");

  return (
    <UserContext.Provider value={{ meUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
