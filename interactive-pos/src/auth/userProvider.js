import React, { createContext, useState } from "react";

const UserContext = createContext();

function UserProvider({children}){
    const [user, setUser] = useState(null);
    const userState = [user, setUser];

   /*  if(sessionStorage.getItem("user")){
        setUser(JSON.parse(sessionStorage.getItem("user")));
    } */

    return(
        <UserContext.Provider value={userState}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContext, UserProvider}