import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import userAtom from 'state/user'

export type User = {
  id: number
  name: string
}

const useUserApi = () => {
  const queryClient = useQueryClient()
  const user = useAtomValue(userAtom)

  const favorites = useQuery<number[]>({
    queryKey: [user?.id, 'favorites'],
    queryFn: () =>
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${user!.id}/favorites`).then(res =>
        res.json()
      ),
    enabled: !!user,
  })

  const removeFavorite = async (quoteId: number) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/users/${user!.id}/favorites/${quoteId}`,
      {
        method: 'DELETE',
      }
    )
    queryClient.invalidateQueries([user?.id, 'favorites'])
    return await res.json()
  }

  const addFavorite = async (quoteId: number) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/users/${user!.id}/favorites/${quoteId}`,
      {
        method: 'POST',
      }
    )
    queryClient.invalidateQueries([user?.id, 'favorites'])
    return await res.json()
  }

  return {
    allUsers: useQuery<User[]>(['users'], async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`)
      return await res.json()
    }),

    createUser: async (user: Partial<User>) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      }
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, requestOptions)
      queryClient.invalidateQueries(['users'])
      return await res.json()
    },

    favorites: favorites.data,

    removeFavorite,

    addFavorite,
  }
}

export default useUserApi
