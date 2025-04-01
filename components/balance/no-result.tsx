"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface NoSearchResultsProps {
  searchQuery: string
  onAddCustomToken: () => void
}

export function NoSearchResults({ searchQuery, onAddCustomToken }: NoSearchResultsProps) {
  return (
    <div className="mt-2 flex flex-grow flex-col sm:mt-4">
      <div className="flex h-full w-full flex-col items-center justify-center py-6">
        <div>
          <Search className="h-12 w-12 text-gray-400" />
        </div>
        <div className="mt-4 text-center text-base font-medium leading-6 text-gray-400">
          No search results <br />
          for &quot;{searchQuery}&quot;
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-center font-medium text-gray-400">Can&apos;t find existing token?</div>
        <Button
          variant="ghost"
          className="text-xs py-2 text-blue-500 hover:bg-blue-100 hover:bg-opacity-25 dark:text-blue-300 dark:hover:bg-blue-900 dark:hover:bg-opacity-25"
          onClick={onAddCustomToken}
        >
          Add custom token
        </Button>
      </div>
    </div>
  )
}

