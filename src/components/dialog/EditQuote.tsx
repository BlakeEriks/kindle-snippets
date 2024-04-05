import { useQuery } from '@tanstack/react-query'
import useBookApi, { Book } from 'api/book'
import useQuoteApi from 'api/quote'
import { Checkbox } from 'components/ui/checkbox'
import { Textarea } from 'components/ui/textarea'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { modalStateAtom } from 'state/modal'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

type EditQuote = {
  content: string
  quotee: string
  deleted: boolean
}

export const EditQuoteDialog = () => {
  const { getBooks } = useBookApi()
  const { save } = useQuoteApi()
  const { data: books } = useQuery<Book[]>(['books'], getBooks)
  const [modalState, setModalState] = useAtom(modalStateAtom('editQuote'))
  const book = books?.find(book => book.id === modalState?.bookId)
  const quote = book?.quotes.find(quote => quote.id === modalState?.quoteId)

  const form = useForm<EditQuote>({ values: quote })

  const handleSubmit = ({ content, quotee, deleted }: EditQuote) => {
    if (!quote) return

    if (content !== quote.content || quotee !== quote.quotee) {
      save({ id: quote.id, content, quotee, deleted })
      toast.success('Quote updated')
    }
    setModalState(null)
  }

  console.log(books, modalState, book, quote)

  return (
    <Dialog open={!!modalState} onOpenChange={isOpen => !isOpen && setModalState(null)}>
      <DialogContent className='sm:max-w-[425px] bg-white'>
        <Form {...form} key={quote?.id}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='gap-2'>
            <DialogHeader>
              <DialogTitle>Edit Quote</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex-1'>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} className='h-48' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='quotee'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quotee</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='deleted'
              render={({ field }) => (
                <FormItem className='flex space-x-3 py-4 items-center space-y-0'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Disabled</FormLabel>
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
