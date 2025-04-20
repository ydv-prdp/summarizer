'use server'
import { getDBConnection } from "@/lib/db";
import { generatePDFSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generatePDFSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { INTERNALS } from "next/dist/server/web/spec-extension/request";

interface PDFSummaryType{
    userId?:string; 
    fileUrl:string; 
    summary:string; 
    title:string; 
    fileName:string
}

export async function generatePDFSummary(uploadResponse:[{
    serverData:{
        userId:string;
        file:{
            url:string;
            name:string;
        }
    }
}]){
    if(!uploadResponse){
        return {
            success:false,
            message:'File upload failed',
            data:null
        }
    }
    const {
        serverData:{
            userId,
            file:{url:pdfUrl,name:fileName},
        },
    } = uploadResponse[0]

    if(!pdfUrl){
        return{
            success:false,
            message:'File upload failed',
            data:null
        }
    }
    try{
        const pdfText  = await fetchAndExtractPdfText(pdfUrl)
        console.log({pdfText})
        let summary;
        try{
            summary = await generatePDFSummaryFromGemini(pdfText)
            // summary = await generatePDFSummaryFromOpenAI(pdfText)
            console.log(summary)
        }catch(error){
            console.error(error)
            if(error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED'){
                try{
                    summary = await generatePDFSummaryFromGemini(pdfText)
                }
                catch(geminiError){
                    console.error('Gemini API failed after OPENAI quote exceeded',geminiError)
                    throw new Error(
                        'Failed to generate summay with available AI providers'
                    )
                }
            }
        }
        if(!summary){
            return {
                success:false,
                message:'Failed to generate summary',
                data:null
            }
        }
        const formattedFileName = formatFileNameAsTitle(fileName)
        return{
            success:true,
            messgae:'Summary generated successfully',
            data:{
                summary,
                title:formattedFileName
            }
        }
    }catch(err){
        return{
            success:false,
            message:'File upload failed',
            data:null
        }
    }
}

async function savedPDFSummary(
    {
        userId,
        fileUrl,
        summary,
        title,
        fileName
    }:PDFSummaryType){
    try{
        const sql = await getDBConnection();
        console.log(userId, fileUrl, summary, title, fileName,sql)
        const [savedSummary] = await sql `INSERT INTO pdf_summaries(
            user_id,
            original_file_url,
            summary_text,
            title,
            file_name
        ) VALUES (
            ${userId},
            ${fileUrl},
            ${summary},
            ${title},
            ${fileName}
        ) RETURNING id, summary_text`;
         return savedSummary
    }catch(err){
        console.error('Error saving PDF summary',err)
        throw err
    }
}

export async function storePDFSummaryAction({fileUrl, summary, title, fileName}:PDFSummaryType){
    let savedSummary:any;
    try{
        const {userId} = await auth();
        if(!userId){
            return {
                success:false,
                message:'User not found'
            }
        }
        savedSummary = await savedPDFSummary({userId, fileUrl, summary,title,fileName});
        if(!savedSummary){
            return{
                success:false,
                message:'Failed to save PDF summary'
            }
        }
      
    }catch(err){
        return{
            success:false,
            message:
            err instanceof Error ? err.message : 'Error saving PDF summary'
        }
    }
    revalidatePath(`/summaries/${savedSummary.id}`)
    return {
        success:true,
        message:'PDF summary saved successfully',
        data:{
            id:savedSummary.id
        }
    }
}