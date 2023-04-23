import { useQueryClient } from '@tanstack/react-query'
import { RcFile } from 'antd/es/upload'
import { useAtomValue } from 'jotai'
import useSnippetsApi from '../api/snippets'
import userAtom from '../state/user'

const useFileUpload = () => {
  const { saveAllSnippets } = useSnippetsApi()
  const queryClient = useQueryClient()
  const user = useAtomValue(userAtom)

  console.log(user)

  return {
    handleUpload: (file: RcFile, FileList: RcFile[]): Promise<any> => {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = async () => {
          const binaryStr = reader.result
          if (!binaryStr || binaryStr instanceof ArrayBuffer) {
            return console.log('failed')
          }
          let snippets = binaryStr
            .split('==========')
            .map(entry => entry.split(/\r?\n/).filter(data => data.length))
          const parsedSnippets = snippets
            .map(([source, meta, content]) => {
              const parts: string[] = meta?.split(' | ')
              const inception = parts?.pop()
              const createdAt = inception && new Date(inception.replace('Added on ', ''))
              return (
                createdAt &&
                content && { source, meta: parts?.join(' | '), content, createdAt, user }
              )
            })
            .filter(Boolean) as any[]

          // Save the snippets to server
          resolve(await saveAllSnippets(parsedSnippets))
        }
      })
    },

    dummyRequest: ({ _file, onSuccess }: any) => {
      setTimeout(() => {
        onSuccess('ok')
      }, 0)
    },
  }
}

export default useFileUpload
