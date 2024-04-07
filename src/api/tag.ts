export type TagType = {
  id: number
  name: string
}

const TagApi = {
  getAllTags: async (): Promise<TagType[]> => {
    const res = await fetch('process.env.REACT_APP_API_URL/tags')
    return await res.json()
  },

  saveTag: async (tag: Partial<TagType>) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    }

    const res = await fetch('process.env.REACT_APP_API_URL/tags', requestOptions)
    return await res.json()
  },
}

export default TagApi
