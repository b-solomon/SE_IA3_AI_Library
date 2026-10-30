import { z } from 'zod'

/**
 * Zod validation schemas for all forms and API inputs.
 * Used by react-hook-form for client-side validation.
 */

/** Registration form validation */
export const registrationSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name must not exceed 80 characters')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegistrationFormData = z.infer<typeof registrationSchema>

/** Login form validation */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/** Digital asset upload form validation */
export const assetUploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  author: z.string().min(1, 'Author is required').max(200, 'Author name is too long'),
  isbn: z.string().max(20, 'ISBN is too long').optional().or(z.literal('')),
  description: z.string().max(2000, 'Description is too long').optional().or(z.literal('')),
  category_id: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().default(false),
})

export type AssetUploadFormData = z.infer<typeof assetUploadSchema>

/** Category form validation */
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional().or(z.literal('')),
  icon: z.string().max(50).optional().or(z.literal('')),
})

export type CategoryFormData = z.infer<typeof categorySchema>

/** Chat message validation */
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(4000, 'Message is too long'),
})

export type ChatMessageFormData = z.infer<typeof chatMessageSchema>

/** Defect form validation */
export const defectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  priority: z.enum(['p1', 'p2', 'p3', 'p4']),
})

export type DefectFormData = z.infer<typeof defectSchema>

/** File upload validation (programmatic, not Zod) */
export const FILE_CONSTRAINTS = {
  allowedTypes: ['application/pdf', 'application/epub+zip'],
  maxFileSizeMB: 50,
} as const
