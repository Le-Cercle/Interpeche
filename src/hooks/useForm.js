import { useState, useCallback } from 'react'
import { validateForm } from '../utils/validation'

export function useForm(initialValues, validationSchema, onSubmit) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const error = validationSchema[name]?.(value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }, [touched, validationSchema])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validationSchema[name]?.(values[name])
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }, [values, validationSchema])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setSubmitError(null)
      setSubmitSuccess(false)

      const newErrors = validateForm(values, validationSchema)
      setErrors(newErrors)
      setTouched(Object.keys(validationSchema).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

      if (Object.keys(newErrors).length > 0) {
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit(values)
        setSubmitSuccess(true)
        setValues(initialValues)
        setTouched({})
      } catch (error) {
        setSubmitError(error.message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validationSchema, onSubmit, initialValues]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setSubmitError(null)
    setSubmitSuccess(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  }
}
