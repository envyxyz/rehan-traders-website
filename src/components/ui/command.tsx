"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "@/components/icons"
import { cn } from "@/lib/utils"

/** Device search (booking). cmdk handles filtering and keyboard; the list sits inline or in a Popover. */
function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn("flex w-full flex-col text-ink", className)}
      {...props}
    />
  )
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-hairline bg-paper px-4 focus-within:border-ink focus-within:bg-card">
      <Search aria-hidden className="size-5 shrink-0 text-steel" strokeWidth={1.75} />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn("h-13 w-full bg-transparent text-body-md outline-none placeholder:text-steel disabled:opacity-50", className)}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-72 min-h-0 scroll-py-1.5 overflow-y-auto overscroll-contain p-1.5", className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className={cn("py-6 text-center text-body-sm text-steel", className)} {...props} />
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-caption **:[[cmdk-group-heading]]:text-steel",
        className
      )}
      {...props}
    />
  )
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 rounded-sm px-3 text-body-md select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-concrete",
        className
      )}
      {...props}
    />
  )
}

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem }
