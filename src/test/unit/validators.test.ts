import { describe, it, expect } from 'vitest'
import { registrationSchema, loginSchema } from '@/lib/validators'
import { validateFile, passwordStrength } from '@/lib/utils'

// ────────────────────────────────────────────────────────────
// validateRegistration — Zod schema
// ────────────────────────────────────────────────────────────

describe('registrationSchema', () => {
  it('TC-BB-01: accepts valid registration data', () => {
    const result = registrationSchema.safeParse({
      full_name: 'John Smith',
      email: 'john@karunya.edu',
      password: 'SecurePass1!',
      confirmPassword: 'SecurePass1!',
    })
    expect(result.success).toBe(true)
  })

  it('TC-BB-02: rejects name shorter than 2 characters', () => {
    const result = registrationSchema.safeParse({
      full_name: 'A',
      email: 'a@b.com',
      password: 'SecurePass1!',
      confirmPassword: 'SecurePass1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/2 characters/)
  })

  it('accepts name at exactly minimum length (2 chars)', () => {
    const result = registrationSchema.safeParse({
      full_name: 'AB',
      email: 'ab@test.edu',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
    })
    expect(result.success).toBe(true)
  })

  it('TC-BB-03: rejects invalid email format', () => {
    const result = registrationSchema.safeParse({
      full_name: 'Test User',
      email: 'not-an-email',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/valid email/)
  })

  it('TC-BB-04: rejects password without uppercase', () => {
    const result = registrationSchema.safeParse({
      full_name: 'Test User',
      email: 'test@test.edu',
      password: 'weakpassword1!',
      confirmPassword: 'weakpassword1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/uppercase/)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = registrationSchema.safeParse({
      full_name: 'Test User',
      email: 'test@test.edu',
      password: 'Sh0rt!',
      confirmPassword: 'Sh0rt!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/8 characters/)
  })

  it('rejects mismatched passwords', () => {
    const result = registrationSchema.safeParse({
      full_name: 'Test User',
      email: 'test@test.edu',
      password: 'StrongPass1!',
      confirmPassword: 'DifferentPass1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Passwords do not match')
  })
})

// ────────────────────────────────────────────────────────────
// validateFile
// ────────────────────────────────────────────────────────────

describe('validateFile', () => {

  it('TC-BB-07: accepts PDF at exactly 50 MB', () => {
    const file = { type: 'application/pdf', size: 50 * 1024 * 1024 } as File
    const result = validateFile(file)
    expect(result.valid).toBe(true)
  })

  it('TC-BB-08: rejects PDF slightly over 50 MB', () => {
    const file = { type: 'application/pdf', size: 50 * 1024 * 1024 + 1 } as File
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/exceed/)
  })

  it('TC-BB-09: rejects DOCX file type', () => {
    const file = { type: 'application/msword', size: 1024 * 1024 } as File
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/PDF and EPUB/)
  })

  it('accepts EPUB file type', () => {
    const file = { type: 'application/epub+zip', size: 2 * 1024 * 1024 } as File
    const result = validateFile(file)
    expect(result.valid).toBe(true)
  })

  it('accepts small PDF file', () => {
    const file = { type: 'application/pdf', size: 1024 } as File
    const result = validateFile(file)
    expect(result.valid).toBe(true)
  })
})

// ────────────────────────────────────────────────────────────
// passwordStrength
// ────────────────────────────────────────────────────────────

describe('passwordStrength', () => {
  it('returns score 0 for empty string', () => {
    expect(passwordStrength('').score).toBe(0)
  })

  it('returns score 1 for short password with length >= 8', () => {
    expect(passwordStrength('password').score).toBeGreaterThan(0)
  })

  it('returns score 4 for strong password', () => {
    expect(passwordStrength('Str0ng!Pass#2').score).toBe(4)
  })
})

// ────────────────────────────────────────────────────────────
// loginSchema
// ────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  it('accepts valid email + password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'anyPassword' })
    expect(result.success).toBe(true)
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'password' })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '' })
    expect(result.success).toBe(false)
  })
})
