import { createContext , useState } from "react"

export const UserC = createContext();
function UserContext({children}) {
    const [user,setUser] = useState(null);
  return (
    <UserC.Provider value={{user,setUser}}>
        {children}
    </UserC.Provider>
  )
}

export default UserContext;