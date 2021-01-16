import React, { useRef } from 'react'
import axios from 'axios'
import Button from '../button'

export interface UploadProps {
    action: string
    beforeUpload?: (file: File) => boolean | Promise<File>
    onChange?: (file: File) => void
    onProgress?: (percentage: number, file: File) => void
    onSuccess?: (data: any, file: File) => void
    onError?: (err: any, file: File) => void
}

const Upload: React.FC<UploadProps> = (props) => {
    const { action, beforeUpload, onChange, onProgress, onSuccess, onError } = props
    const fileInput = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        uploadFiles(files)
        if (fileInput.current) {
            fileInput.current.value = ''
        }
    }

    const uploadFiles = (files: FileList) => {
        let postFiles = Array.from(files)
        postFiles.forEach(file => {
            if (!beforeUpload) {
                post(file)
            } else {
                const result = beforeUpload(file)
                if (result && result instanceof Promise) {
                    result.then(processedFile => {
                        post(processedFile)
                    })
                } else if (result !== false) {
                    post(file)
                }
            }
        })
    }

    const post = (file: File) => {
        const formData = new FormData()
        formData.append(file.name, file)
        axios.post(action, formData, {
            headers: {
                'Content-Type': "multipart/form-data"
            },
            onUploadProgress: (e) => {
                let percentage = Math.round((e.loaded * 100) / e.total) || 0
                if (percentage < 100 && onProgress) {
                    onProgress(percentage, file)
                }
            }
        }).then(res => {
            if (onSuccess) {
                onSuccess(res.data, file)
            }
            if (onChange) {
                onChange(file)
            }
        }).catch(err => {
            if (onError) {
                onError(err, file)
            }
            if (onChange) {
                onChange(file)
            }
        })
    }
    return (
        <div className="web-upload">
            <Button type="primary" onClick={handleClick}>upload file</Button>
            <input
                className="web-file-input"
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            >
            </input>
        </div>
    )
}

export default Upload;