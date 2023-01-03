import { RcFile } from "antd/es/upload"
import { useNavigate } from "react-router-dom"

const useFileUpload = () => {

  const navigate = useNavigate()

  return {
    handleUpload(file: RcFile, FileList: RcFile[]): Promise<any> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsText(file)
        reader.onload = () => {
          const binaryStr = reader.result
          if (!binaryStr || binaryStr instanceof ArrayBuffer) { 
            return console.log('failed')
          }
          let snippets = binaryStr.split('==========').map(entry => entry.split(/\r?\n/).filter(data => data.length))
          const parsedSnippets = snippets.map(([source, meta, content]) => {
            const parts: string[] = meta?.split(" | ")
            const inception = parts?.pop()
            const createdAt = inception && new Date(inception.replace('Added on ',''))
            return createdAt && { source, meta: parts?.join(" | "), content, createdAt }
          }).filter(Boolean)

          navigate('/upload', { state: { snippets: parsedSnippets } })
          resolve(parsedSnippets)
        }
      })
    },

    dummyRequest: ({ _file, onSuccess }: any) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    }
  }
}

export default useFileUpload