import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatErrors(error: any) {
  if (error.name === 'ZodError') {
    //Handle zod error
    const fieldErros = Object.keys(error.errors).map((field) => error.errors[field].message)
    return fieldErros.join('. ')
  } else if (error.code === 'P2002' && error.name === 'PrismaClientKnownRequestError') {
    //Handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field'
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    // Handle other errors
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
  }
}