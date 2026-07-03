const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = {
  async sendContactMessage(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de l\'envoi')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Erreur réseau. Veuillez réessayer.')
    }
  },

  async subscribeNewsletter(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de l\'inscription')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Erreur réseau. Veuillez réessayer.')
    }
  },
}
