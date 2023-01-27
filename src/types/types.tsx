export type Author = {
  id?:     number
  name:   string
}

export type Book = {
  id?:      number
  title:    string
  author:   Author
}

export type Quote = {
  id?:        number
  source:     Book
  quotee:     string
  content:    string
  meta:       string
  createdAt:  Date
  tags:       Tag[]
}

export type Snippet = {
  source:  string
  meta: string
  createdAt: Date
  content: string
}

export type User = {
  id: number
  name: string
}

export type Tag = {
  id: number
  name: string
}