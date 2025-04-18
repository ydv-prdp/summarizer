'use client'
import { useUploadThing } from "@/utils/uploadthing"
import UploadFormInput from "./upload-form-input"
import {z} from 'zod'
 
import { toast } from "sonner"
import { generatePDFSummary } from "@/actions/upload-actions"
const schema = z.object({
    file:z
        .instanceof(File,{message:'Invalid file'})
        .refine((file)=>file.size <=20 * 1024 * 1024,{
            message:'File size must be less than 20MB'
        })
        .refine((file)=>file.type.startsWith('application/pdf'),'File must be a PDF')    
})

const UploadForm = () => {
  
    const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
        onClientUploadComplete: () => {
          toast.success("Uploaded successfully!");
        },
        onUploadError: (err) => {
          toast.error("Error occurred while uploading");
        }
      });
    
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const file = formData.get('file') as File;
        const validatedFields = schema.safeParse({file})
        if(!validatedFields.success){
            console.log(validatedFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid File')
            return
        }
        toast.success('Uploading your PDF...')
        const resp = await startUpload([file])
        if(!resp){
            toast.error('Something went wrong while processing PDF')
            return;
        }
        toast.success('Processing your PDF')

        const summary = await generatePDFSummary(resp)
        console.log({summary})

    }
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit}/>
    </div>
  )
}

export default UploadForm