import { Modal as AntdModal } from 'antd'
import useModal from '../state/modal'

const Modal = () => {
  const { open, props, closeModal } = useModal()

  return (
    <AntdModal {...props} open={false} onCancel={closeModal}>
      {props.children}
    </AntdModal>
  )
}

export default Modal
