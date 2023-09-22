import React from 'react'
import { toast } from 'react-toastify'

export const Button123 = () => {
  return (
    <>
        <div>button</div>
        <button onClick={() => toast('hello')} >click me</button>

    </>
  )
}
