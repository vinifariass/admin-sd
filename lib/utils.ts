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

// Converte valores null para string vazia para compatibilidade com formulários
export function convertNullToEmptyString<T extends Record<string, any>>(
  object: T,
  fieldsToConvert: (keyof T)[]
): T {
  if (!object) return object;
  
  const converted = { ...object };
  
  for (const field of fieldsToConvert) {
    if (converted[field] === null || converted[field] === undefined) {
      converted[field] = "" as any;
    }
  }
  
  return converted;
}

// Converte strings vazias para null para compatibilidade com banco de dados
export function convertEmptyStringToNull<T extends Record<string, any>>(
  object: T,
  fieldsToConvert: (keyof T)[]
): T {
  if (!object) return object;
  
  const converted = { ...object };
  
  for (const field of fieldsToConvert) {
    if (converted[field] === "" || converted[field] === undefined) {
      converted[field] = null as any;
    }
  }
  
  return converted;
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

export function parseSalary(valor: string | number) {
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;

  if (isNaN(numero)) return '0,00';

  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Shorteen UUID
export function formatId(id: string) {
  return `...${id.substring(id.length - 6)}`
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}