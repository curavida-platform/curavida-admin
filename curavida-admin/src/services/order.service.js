import api from './api'

const orderService = {
  async getAll() {
    const response = await api.get('/orders')

    return response.data
  },

  async create(order) {
    const response = await api.post('/orders', order)

    return response.data
  },
}

export default orderService