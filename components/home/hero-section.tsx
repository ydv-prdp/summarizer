import { ArrowRight, Sparkle } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import Link from "next/link"

const HeroSection = () => {
  return (
    <section className="relative mx-auto flex flex-col z-0 items-center py-16 sm:py-20 lg:pb-28 transition-all animate-in lg:px-12 max-w-7xl">
        <div className="">
            <Badge className="relative px-4 py-2 overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group ">
                <Sparkle className="h-6 w-6 mr-2 text-rose-600 animate-pulse"/>
                <p>Powered by AI</p>
            </Badge>
        </div>
        <h1 className="font-bold py-6 text-center text-3xl">Transfrom PDFs into consice summaries.</h1>
        <h2 className="text-lg sm:text-xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-600">Get a beautiful summary reel of the document in seconds.</h2>
        <Button className="text-white mt-6 text-base sm:text-lg lg:text-xl rounded-full px-8 sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8 lg:mt-16 bg-linear-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 font-bold">
            <Link href={"/pricing"} className="flex gap-2 items-center">
                <span>Try Summarizer</span>
                <ArrowRight className="animate-pulse"/>
            </Link>
        </Button>
        
    </section>
  )
}

export default HeroSection