import { useReducer } from "react"
import { InitialStates, UserContext, UserReducer } from "./reducer"

export const UserProvider = ({children}:any) =>{
    const [state, dispatch] =useReducer(UserReducer, InitialStates)
    return(
       <UserContext.Provider value={{state, dispatch}}>
            {children}
        </UserContext.Provider>
    )
}