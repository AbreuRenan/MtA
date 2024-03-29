import React from 'react'

export default function Input({label, type}) {
    const [labelState, setLabelState] = React.useState(label);
    const [inputState, setInputState] = React.useState(null);


    function inputChangeHandler(e) {
      setInputState(e.target.value)
    }
  return (
    <>
    <labelState for={labelState}>{labelState}</labelState>
    <input id={labelState} name={labelState} type={type ?? 'text'} onChange={inputChangeHandler} value={inputState}/>
    
    </>
  )
}
