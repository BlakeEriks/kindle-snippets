import { atomWithStorage } from 'jotai/utils'

const deletedSnippetsAtom = atomWithStorage<number[]>('deleted-snippets', [])

export default deletedSnippetsAtom