'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import NavigationControls from "./navigation-controls";

const parseSection = (section:string)=>{
    const [title,...content] = section.split('\n')

    const cleanTitle = title.startsWith('#') ? title.substring(1).trim() : title.trim();
    const points:String[] = [];
     let currentPoint = ''
     content.forEach((line)=>{
        const trimmedLine = line.trim();
        if(trimmedLine.startsWith('.')){
            if(currentPoint) {points.push(currentPoint.trim())}
            currentPoint = trimmedLine
        }else if(!trimmedLine){
            if(currentPoint) points.push(currentPoint.trim())
            currentPoint = ''
        } else{
            currentPoint += ' ' + trimmedLine
        }
     })
    
     if(currentPoint) {
        points.push(currentPoint.trim())
     }
    return {
        title:cleanTitle,
        points:points.filter((point)=>point && !point.startsWith('#') && !point.startsWith('[Choose')),
    }
}

const SummaryViewer = ({summary}:{summary:string}) => {
    const [currentSection,setCurrentSection] = useState(0)
    const sections = summary 
        .split('\n# ')
        .map((section)=>section.trim())
        .filter(Boolean)
        .map(parseSection)
  return (
    <Card
        className="relative px-2 h-[500px] sm:h-[600px] lg:h-[700px] w-full xl:w-[600px] overflow-hidden bg-linear-to-br from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10"
    >
        <div className="h-full overflow-y-auto scrollbar-hide pt-2 sm:pt-2 pb-20 sm:pb-24">
            <div className="px-4 sm:px-6">
                <h2 className="font-bold text-xl">{sections[currentSection]?.title || ''}</h2>
                <ul>
                    {sections[currentSection]?.points.map((point,index)=>(
                        <li key={index} className="pt-2 font-semibold">
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </Card>
    
  )
}

export default SummaryViewer