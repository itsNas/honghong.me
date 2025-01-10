import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cn } from '@tszhong0411/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { XIcon } from 'lucide-react'

export const sheetVariants = cva(
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom:
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        right:
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm'
      }
    },
    defaultVariants: {
      side: 'right'
    }
  }
)

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetPortal = SheetPrimitive.Portal
export const SheetClose = SheetPrimitive.Close

type SheetOverlayProps = React.ComponentProps<typeof SheetPrimitive.Overlay>

export const SheetOverlay = (props: SheetOverlayProps) => {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/80',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...rest}
    />
  )
}

type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> &
  VariantProps<typeof sheetVariants>

export const SheetContent = (props: SheetContentProps) => {
  const { side = 'right', className, children, ...rest } = props

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content className={cn(sheetVariants({ side }), className)} {...rest}>
        {children}
        <SheetPrimitive.Close className='ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none'>
          <span className='sr-only'>Close</span>
          <XIcon className='size-4' />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

type SheetHeaderProps = React.ComponentProps<'div'>

export const SheetHeader = (props: SheetHeaderProps) => {
  const { className, ...rest } = props

  return <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...rest} />
}

type SheetFooterProps = React.ComponentProps<'div'>

export const SheetFooter = (props: SheetFooterProps) => {
  const { className, ...rest } = props

  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
      {...rest}
    />
  )
}

type SheetTitleProps = React.ComponentProps<typeof SheetPrimitive.Title>

export const SheetTitle = (props: SheetTitleProps) => {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Title
      className={cn('text-foreground text-lg font-semibold', className)}
      {...rest}
    />
  )
}

type SheetDescriptionProps = React.ComponentProps<typeof SheetPrimitive.Description>

export const SheetDescription = (props: SheetDescriptionProps) => {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...rest}
    />
  )
}
