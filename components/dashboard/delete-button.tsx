'use client'
import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from "react"
import { deleteSummary } from "@/actions/summary-actions"
import { toast } from "sonner"


const DeleteButton = ({ summaryId,title }: { summaryId: string,title:string }) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteSummary({ summaryId, title })
      console.log(result)
      if (!result.success) {
        toast.error('Failed to delete summary')
      }
      toast.success('Summary deleted successfully')
      setOpen(false)
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} size={"icon"} className="cursor-pointer hover:text-gray-400">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Summary</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the summary? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'ghost'} className="bg-gray-50 border border-gray-200 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button variant={'destructive'} className="bg-gray-900 hover:bg-gray-600 cursor-pointer"
            onClick={handleDelete}
          >
            {isPending ? "Deleting...":"Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteButton