import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from './useForm'

describe('useForm', () => {
  const initialValues = { email: '', name: '' }
  const validationSchema = {
    email: (value) => (!value ? 'Email requis' : null),
    name: (value) => (!value ? 'Nom requis' : null),
  }

  it('should initialize with provided values', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema, vi.fn())
    )
    expect(result.current.values).toEqual(initialValues)
  })

  it('should update values on change', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema, vi.fn())
    )

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      })
    })

    expect(result.current.values.email).toBe('test@example.com')
  })

  it('should validate on blur', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema, vi.fn())
    )

    act(() => {
      result.current.handleBlur({ target: { name: 'email' } })
    })

    expect(result.current.touched.email).toBe(true)
    expect(result.current.errors.email).toBe('Email requis')
  })

  it('should call onSubmit with valid data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema, onSubmit)
    )

    act(() => {
      result.current.setValues({ email: 'test@example.com', name: 'John' })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'John',
    })
  })

  it('should not call onSubmit with invalid data', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema, onSubmit)
    )

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.email).toBe('Email requis')
    expect(result.current.errors.name).toBe('Nom requis')
  })

  it('should reset form', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema, vi.fn())
    )

    act(() => {
      result.current.setValues({ email: 'test@example.com', name: 'John' })
    })

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })

  it('should handle submit errors', async () => {
    const error = new Error('Network error')
    const onSubmit = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() =>
      useForm(initialValues, validationSchema, onSubmit)
    )

    act(() => {
      result.current.setValues({ email: 'test@example.com', name: 'John' })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(result.current.submitError).toBe('Network error')
  })
})
