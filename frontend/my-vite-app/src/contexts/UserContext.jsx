import { createContext, useContext, useEffect, useState } from "react";


const UserContext = createContext();

export const UserProvider = ({children})=>{
    const [user,setUser] = useState(null);

    useEffect(()=>{
        const storeUser = localStorage.getItem('username');
        if(storeUser){
            setUser(storeUser);
        }
    },[]);

    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser=()=>{
    return useContext(UserContext);
};