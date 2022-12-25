import Dropzone from "react-dropzone"

type FileDropProps = {
  setMode: Function,
  setSnippets: Function,
}
const FileDrop = ({setMode, setSnippets}: FileDropProps) => {
  const onDrop = (acceptedFiles: any) => {
    const reader = new FileReader()
    acceptedFiles.forEach((file: any) => {
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        if (!binaryStr || binaryStr instanceof ArrayBuffer) {
          console.log('failed')
          return
        }
        setMode('analyzing')
        let snippets = binaryStr.split('==========').map(entry => entry.split(/\r?\n/).filter(data => data.length))
        const parsedSnippets = snippets.map(([source, meta, content]) => {
          if (!source || !meta || !content ) return { source, meta, content, createdAt: new Date() }
  
          const parts: string[] = meta.split(" | ")
          const inception = parts.pop()
          const createdAt = new Date(inception!.replace('Added on ',''))
          return { source, meta: parts.join(" | "), content, createdAt }
        })
  
        setSnippets(parsedSnippets)
      }
      reader.readAsText(file)
    })
  }
  

  return (
    <Dropzone onDrop={onDrop}>
      {({getRootProps, getInputProps}) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
              <p> Drag a <b className='mx-1'>Clippings.txt</b> file here to process </p>
              <div>
          </div>
        </div>
      )}
    </Dropzone>
  )
}

export default FileDrop