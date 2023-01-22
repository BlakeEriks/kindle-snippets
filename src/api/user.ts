import { useQuery, useQueryClient } from "react-query"
import { User } from "../types/types"

const useUserApi = () => {

  const queryClient = useQueryClient()

  return {
    allUsers: useQuery<User[], Error>('users', async () => {
      const res = await fetch("http://localhost:8000/users")
      return await res.json()
    }),

    createUser: async (user: Partial<User>) => {
      const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }
      const res = await fetch("http://localhost:8000/users", requestOptions)
      queryClient.invalidateQueries('users')
      return await res.json()
    }
  }
}

export default useUserApi