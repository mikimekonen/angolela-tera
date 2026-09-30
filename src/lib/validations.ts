/**
 * Zod validation schemas for the contact form and other public inputs.
 * Used in both client-side (for instant feedback) and server-side (for security).
 */

import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(200, 'Email must be under 200 characters')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(20, 'Phone number must be under 20 characters')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be under 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be under 5000 characters')
    .trim(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

// ------------------------------------------------------------------
// Admin login schema
// ------------------------------------------------------------------
export const loginSchema = z.object({
  email:    z.string().email().toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ------------------------------------------------------------------
// Search schema
// ------------------------------------------------------------------
export const searchSchema = z.object({
  q:      z.string().min(1).max(200).trim(),
  locale: z.enum(['en', 'am', 'om']).default('en'),
  page:   z.coerce.number().int().positive().default(1),
})

export type SearchInput = z.infer<typeof searchSchema>

// ------------------------------------------------------------------
// Pagination schema
// ------------------------------------------------------------------
export const paginationSchema = z.object({
  page:     z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
})

export type PaginationInput = z.infer<typeof paginationSchema>
