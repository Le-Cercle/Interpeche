import { describe, it, expect } from 'vitest'
import { validators, validateForm } from './validation'

describe('validators', () => {
  describe('email', () => {
    it('should reject empty email', () => {
      expect(validators.email('')).toBe('Email requis')
    })

    it('should reject invalid email format', () => {
      expect(validators.email('invalid')).toBe('Email invalide')
      expect(validators.email('invalid@')).toBe('Email invalide')
      expect(validators.email('@example.com')).toBe('Email invalide')
    })

    it('should accept valid email', () => {
      expect(validators.email('test@example.com')).toBeNull()
      expect(validators.email('user.name+tag@example.co.uk')).toBeNull()
    })
  })

  describe('name', () => {
    it('should reject empty name', () => {
      expect(validators.name('')).toBe('Nom requis')
    })

    it('should reject name shorter than 2 characters', () => {
      expect(validators.name('a')).toBe('Nom trop court (min 2 caractères)')
    })

    it('should reject name longer than 100 characters', () => {
      const longName = 'a'.repeat(101)
      expect(validators.name(longName)).toBe('Nom trop long (max 100 caractères)')
    })

    it('should accept valid name', () => {
      expect(validators.name('Jean Dupont')).toBeNull()
      expect(validators.name('ab')).toBeNull()
      expect(validators.name('a'.repeat(100))).toBeNull()
    })
  })

  describe('subject', () => {
    it('should reject empty subject', () => {
      expect(validators.subject('')).toBe('Sujet requis')
    })

    it('should accept any non-empty subject', () => {
      expect(validators.subject('Test')).toBeNull()
      expect(validators.subject('Partenariat')).toBeNull()
    })
  })

  describe('message', () => {
    it('should reject empty message', () => {
      expect(validators.message('')).toBe('Message requis')
    })

    it('should reject message shorter than 10 characters', () => {
      expect(validators.message('short')).toBe('Message trop court (min 10 caractères)')
    })

    it('should reject message longer than 5000 characters', () => {
      const longMessage = 'a'.repeat(5001)
      expect(validators.message(longMessage)).toBe('Message trop long (max 5000 caractères)')
    })

    it('should accept valid message', () => {
      expect(validators.message('This is a valid message')).toBeNull()
      expect(validators.message('a'.repeat(10))).toBeNull()
    })
  })

  describe('phone', () => {
    it('should reject empty phone', () => {
      expect(validators.phone('')).toBe('Téléphone requis')
    })

    it('should reject invalid phone format', () => {
      expect(validators.phone('abc123')).toBe('Numéro de téléphone invalide')
      expect(validators.phone('phone@number')).toBe('Numéro de téléphone invalide')
    })

    it('should accept valid phone numbers', () => {
      expect(validators.phone('+225 27 21 73 81 52')).toBeNull()
      expect(validators.phone('0720050505')).toBeNull()
      expect(validators.phone('+33 (0) 1 23 45 67 89')).toBeNull()
    })
  })
})

describe('validateForm', () => {
  it('should return empty object for valid form', () => {
    const schema = {
      email: validators.email,
      name: validators.name,
    }
    const data = {
      email: 'test@example.com',
      name: 'John Doe',
    }
    expect(validateForm(data, schema)).toEqual({})
  })

  it('should return errors for invalid form', () => {
    const schema = {
      email: validators.email,
      name: validators.name,
    }
    const data = {
      email: 'invalid',
      name: 'a',
    }
    const errors = validateForm(data, schema)
    expect(errors.email).toBe('Email invalide')
    expect(errors.name).toBe('Nom trop court (min 2 caractères)')
  })

  it('should only include fields with errors', () => {
    const schema = {
      email: validators.email,
      name: validators.name,
    }
    const data = {
      email: 'test@example.com',
      name: 'a',
    }
    const errors = validateForm(data, schema)
    expect(errors.email).toBeUndefined()
    expect(errors.name).toBe('Nom trop court (min 2 caractères)')
  })
})
