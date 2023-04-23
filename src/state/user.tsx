import { atomWithStorage } from 'jotai/utils'
import { User } from '../api/user'

const userAtom = atomWithStorage<User | undefined>('activeUser', undefined)

export default userAtom
