import api from './api'

const orderService = {
  async getAll() {
    const response = await api.get('/orders')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, {
      status,
    })

    return response.data
  },
}

export default orderService