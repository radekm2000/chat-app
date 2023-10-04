import { ReactNode, createContext, useContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({children}: {children: ReactNode}) => {
    const [meUser, setUser] = useState({username: ''})

    return(
        <UserContext.Provider value={{meUser, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

