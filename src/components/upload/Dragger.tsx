import React, { useState } from 'react'
import classNames from 'classnames'

interface DraggerProps {
    onFile: (fileList: FileList) => void
}

const Dragger: React.FC<DraggerProps> = (props) => {
    const { onFile, children } = props
    const [dragOver, setDragOver] = useState(false)

    const classes = classNames('web-uploader-dragger', {
        'is-dragover': dragOver
    })

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        setDragOver(false)
        onFile(e.dataTransfer.files)
    }

    const handleDrag = (e: React.DragEvent<HTMLElement>, over: boolean) => {
        e.preventDefault()
        setDragOver(over)
    }
    return <div className={classes}
        onDragOver={e => handleDrag(e, true)}
        onDragLeave={e => handleDrag(e, false)}
        onDrop={e => handleDrop(e)}
    >
        {children}
    </div>
}

export default Dragger