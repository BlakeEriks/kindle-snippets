import { useQuery } from '@tanstack/react-query'
import useAuthorApi from 'api/author'
import useBookApi, { Book } from 'api/book'
import { useAtom } from 'jotai'
import { titleCase } from 'lib/utils'
import { CaseSensitiveIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { modalStateAtom } from 'state/modal'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

type EditBook = {
  title: string
  author: string
}

export const EditBookDialog = () => {
  const { getBooks, saveBook } = useBookApi()
  const { saveAuthor } = useAuthorApi()
  const { data: books } = useQuery<Book[]>(['books'], getBooks)
  const [modalState, setModalState] = useAtom(modalStateAtom('editBook'))
  const book = books?.find(book => book.id === modalState?.bookId)

  const form = useForm<EditBook>({
    // resolver: zodResolver(FormSchema),
    defaultValues: {
      title: book?.title,
      author: book?.author.name,
    },
  })

  const handleSubmit = (data: EditBook) => {
    if (!book) return
    let edited = false
    if (data.author !== book.author.name) {
      saveAuthor({ id: book.author.id, name: data.author })
      edited = true
    }
    if (data.title !== book.title) {
      saveBook({ id: book.id, title: data.title })
      edited = true
    }
    if (edited) toast.success('Book updated')
    setModalState(null)
  }

  useEffect(() => {
    if (!book) return

    form.reset({
      title: book.title,
      author: book.author.name,
    })
  }, [book])

  return (
    <Dialog open={!!modalState} onOpenChange={isOpen => !isOpen && setModalState(null)}>
      <DialogContent className='sm:max-w-[425px] bg-white'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='gap-2'>
            <DialogHeader>
              <DialogTitle>Edit Book</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center'>
                    <FormLabel className='flex-1'>Title</FormLabel>
                    <Button
                      size='sm'
                      className='h-6'
                      type='button'
                      onClick={() => form.setValue('title', titleCase(field.value))}
                    >
                      <CaseSensitiveIcon />
                    </Button>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='author'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
