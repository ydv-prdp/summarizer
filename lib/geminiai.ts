import { SUMMARY_SYSTEM_PROMPT } from '@/utils/prompts';
import {GoogleGenerativeAI} from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
export const generatePDFSummaryFromGemini = async(pdfText:string)=>{
    try{
        const model = genAI.getGenerativeModel({model:'gemini-1.5-pro-002'})
        const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`;
        const result = await model.generateContent(prompt)
        const response = await result.response;
        return response.text()
    }
    catch(error:any){
        if(error?.status === 429){
            throw new Error('RATE_LIMIT_EXCEEDED')
        }
        console.log('GEMINI API ERROR:',Error)
        throw error;
    }
}