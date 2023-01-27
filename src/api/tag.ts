import { Tag } from "../types/types"

const TagApi = {
  getAllTags: async (): Promise<Tag[]> => {
    const res = await fetch("http://localhost:8000/tags")
    return await res.json()
  },

  saveTag: async (tag: Partial<Tag>) => {
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag)
    }
  
    const res = await fetch("http://localhost:8000/tags", requestOptions)
    return await res.json()
  },
}

export default TagApi
