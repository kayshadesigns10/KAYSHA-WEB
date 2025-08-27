import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGoogleDriveEmbedUrl(url: string): string {
  const fileId = url.match(/d\/(.*?)\//);
  if (fileId && fileId[1]) {
    return `https://drive.google.com/file/d/${fileId[1]}/preview`;
  }
  // Return a fallback or the original URL if the format is unexpected
  return url;
}

// Currency utility function
export function formatCurrency(amount: number): string {
  const currencySymbol = import.meta.env.VITE_CURRENCY_SYMBOL || '₹';
  return `${currencySymbol}${amount.toLocaleString()}`;
}

export function getCurrencySymbol(): string {
  return import.meta.env.VITE_CURRENCY_SYMBOL || '₹';
}
