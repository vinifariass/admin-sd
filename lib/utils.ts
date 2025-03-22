import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string';

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

// Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
}

export function convertToPlainObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object))
}

export const formatDateTime = (dateInput: string | Date) => {
  // Se for uma string, converte para Date
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false, // Alterado para 24h (se precisar, mude para true)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false, // Alterado para 24h (se precisar, mude para true)
  };

  return {
    dateTime: date.toLocaleString("pt-BR", dateTimeOptions), // 🇧🇷 Agora em português
    dateOnly: date.toLocaleString("pt-BR", dateOptions),
    timeOnly: date.toLocaleString("pt-BR", timeOptions),
  };
};

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

export function parseSalary(value: string): number | null {
  // Remove pontos e substitui vírgula por ponto para converter para número
  const numericValue = value.replace(/\./g, "").replace(",", ".");
  return numericValue ? parseFloat(numericValue) : null;
}