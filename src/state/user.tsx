import { atomWithStorage } from 'jotai/utils'
import { User } from '../types/types'

const userAtom = atomWithStorage<User | undefined>('activeUser', undefined)

export default userAtom