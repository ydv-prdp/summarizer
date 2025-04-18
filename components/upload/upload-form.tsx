'use client'
import { useUploadThing } from "@/utils/uploadthing"
import UploadFormInput from "./upload-form-input"
import { z } from 'zod'

import { toast } from "sonner"
import { generatePDFSummary } from "@/actions/upload-actions"
import { useRef, useState } from "react"
const schema = z.object({
    file: z
        .instanceof(File, { message: 'Invalid file' })
        .refine((file) => file.size <= 20 * 1024 * 1024, {
            message: 'File size must be less than 20MB'
        })
        .refine((file) => file.type.startsWith('application/pdf'), 'File must be a PDF')
})

const UploadForm = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const [isLoading,setIsLoading] = useState(false)

    const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
        onClientUploadComplete: () => {
            toast.success("Uploaded successfully!");
        },
        onUploadError: (err) => {
            toast.error("Error occurred while uploading");
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const formData = new FormData(e.currentTarget)
            const file = formData.get('file') as File;
            const validatedFields = schema.safeParse({ file })
            if (!validatedFields.success) {
                toast.error(validatedFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid File')
                setIsLoading(false)
                return
            }
            toast.success('Uploading your PDF...')
            const resp = await startUpload([file])
            if (!resp) {
                toast.error('Something went wrong while processing PDF')
                setIsLoading(false)
                return;
            }
            toast.success('Processing your PDF')

            const result = await generatePDFSummary(resp)
            const { data = null, message = null } = result || {}
            if (data) {
                toast.success('Saving PDF...')
                formRef.current?.reset()
            }
        } catch (err) {
            setIsLoading(false)
            console.error('Error occurred', err)
            formRef.current?.reset()
        }

    }
    return (
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
            <UploadFormInput isLoading={isLoading} ref={formRef} onSubmit={handleSubmit} />
        </div>
    )
}

export default UploadForm