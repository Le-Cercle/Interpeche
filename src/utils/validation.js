export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) return 'Email requis'
    if (!emailRegex.test(value)) return 'Email invalide'
    return null
  },

  name: (value) => {
    if (!value) return 'Nom requis'
    if (value.trim().length < 2) return 'Nom trop court (min 2 caractères)'
    if (value.trim().length > 100) return 'Nom trop long (max 100 caractères)'
    return null
  },

  subject: (value) => {
    if (!value) return 'Sujet requis'
    return null
  },

  message: (value) => {
    if (!value) return 'Message requis'
    if (value.trim().length < 10) return 'Message trop court (min 10 caractères)'
    if (value.trim().length > 5000) return 'Message trop long (max 5000 caractères)'
    return null
  },

  phone: (value) => {
    if (!value) return 'Téléphone requis'
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(value)) return 'Numéro de téléphone invalide'
    return null
  },
}

export const validateForm = (data, schema) => {
  const errors = {}
  Object.keys(schema).forEach((field) => {
    const error = schema[field](data[field])
    if (error) errors[field] = error
  })
  return errors
}
