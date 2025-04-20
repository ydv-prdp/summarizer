'use server'

import { getDBConnection } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { utapi } from "@/actions/server/uploadthing"

export async function deleteSummary({summaryId,title}:{summaryId:string; title:string}){
    try{
        const user = await currentUser();
        const userId = user?.id
        if(!userId){
            throw new Error('User not found')
        }
        const sql= await getDBConnection();
        const result = await sql `DELETE from pdf_summaries WHERE id=${summaryId} AND user_id=${userId} RETURNING id`;
        if(result.length > 0){
            revalidatePath('/dashboard')
            return {success:true}
        }
        return {success:true}
    }catch(error){
        console.error("Error deleting summary",error)
        return {success:false}
    }
}