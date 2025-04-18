'use server'
import { generatePDFSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generatePDFSummaryFromOpenAI } from "@/lib/openai";

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
    }catch(err){
        return{
            success:false,
            message:'File upload failed',
            data:null
        }
    }
}