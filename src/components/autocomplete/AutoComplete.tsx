import React, { FC, useState, ChangeEvent } from 'react'
import Input, { InputProps } from '../input/Input'

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => string[]
    onSelect?: (item: string) => void
}

const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const { fetchSuggestions, onSelect, value, ...rest } = props
    const [inputValue,setInputValue] = useState(value)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)
    }
    return (
        <div className="auto-complete">
            <Input value={value} onChange={handleChange} {...rest}/>
        </div>
    )
}

export default AutoComplete