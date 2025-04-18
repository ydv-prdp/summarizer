import { SUMMARY_SYSTEM_PROMPT } from '@/utils/prompts';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://beta.sree.shop/v1',
  apiKey: "ddc-beta-lxumivtqmh-IXIaNYVbsOZfzcGI2LZDXSZWXmY8XLNz1bF"  
});

export async function generatePDFSummaryFromOpenAI(pdfText:string){
    try{
    const response = await client.chat.completions.create({
        model: 'Provider-7/gpt-4o',
        messages: [
          {
            role:"system",
            content:SUMMARY_SYSTEM_PROMPT,
          },
          { 
            role: 'user', 
            content: `Tranfrom this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}` 
          },
        ],
        temperature:0.7,
        max_tokens:1500
      });
      return response.choices[0].message.content
    }
    catch(error:any){
        if(error?.status === 429){
            throw new Error('RATE_LIMIT_EXCEEDED')
        }
        throw error;
    }
}

