import React, { FC } from 'react'

type PropsType = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
const TextInput: FC<PropsType> = ({className,...props}) => {
  return (
    <input className={className+" h-8 rounded-md border border-black "} {...props}/>
  )
}

export default TextInput
