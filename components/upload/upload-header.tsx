import { Sparkles } from "lucide-react"
import { Badge } from "../ui/badge"

const UploadHeader = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group">
                <Badge
                    className="relative px-6 py-2 text-rose-500 font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors"
                    variant={'secondary'}
                >
                    <Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse" />
                    <span>AI-powered Content Creation</span>
                </Badge>
            </div>
            <div className="capitalize tracking-tight text-gray-900 sm:text-4xl">
                <h1 className="text-5xl font-bold">Start Uploading Your PDFs</h1>
            </div>
            <div className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl">
                <p>
                    Upload your PDF and let our AI do the magic!
                </p>
            </div>
        </div>
    )
}

export default UploadHeader