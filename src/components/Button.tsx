import { Button as AntdButton, ButtonProps } from 'antd'

export const Button = ({className, ...props}: ButtonProps) => {
  return (
    <AntdButton
      className={(className || '') + ' mr-2 flex items-center justify-center'}
      {...props} 
    />
  )
}

export default Button