import { ModalProps } from 'antd'
import { atom, useAtom, useAtomValue } from 'jotai'

const isModalOpenAtom = atom(false)
const modalPropsAtom = atom<ModalProps>({})
const openModalAtom = atom(
  (_get) => null,
  (_get, set, modalProps: ModalProps) => {
    set(isModalOpenAtom, true)
    set(modalPropsAtom, modalProps)
  }
)
const closeModalAtom = atom(
  (_get) => null,
  (_get, set, _component) => {
    set(isModalOpenAtom, false)
    set(modalPropsAtom, {})
  }
)

const useModal = () => {
  const open = useAtomValue(isModalOpenAtom)
  const props = useAtomValue(modalPropsAtom)
  const [, setOpenModal] = useAtom(openModalAtom)
  const [, setCloseModal] = useAtom(closeModalAtom)

  return {
    props,
    open,
    openModal: (props: ModalProps) => {
      setOpenModal(props)
    },
    closeModal: () => {
      setCloseModal()
    }
  }
}

export default useModal