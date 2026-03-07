import * as React from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        {title && (
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("flex justify-end gap-2 mt-6", className)}>
      {children}
    </div>
  )
}
