import { atomWithStorage } from 'jotai/utils'

type SourceMap = {
  [key: string]: number
}

const sourceMapAtom = atomWithStorage<SourceMap>('activeUser', {})

export default sourceMapAtom