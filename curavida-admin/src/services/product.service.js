import api from './api'

const productService = {
  async getAll() {
    const response = await api.get('/products')

    return response.data
  },

  async getBySlug(slug) {
    const response = await api.get(`/products/${slug}`)

    return response.data
  },

  async create(product) {
    const response = await api.post('/products', product)

    return response.data
  },

  async addImage(productId, imageData) {
    const response = await api.post(
      `/products/${productId}/images`,
      imageData,
    )

    return response.data
  },
}

export default productService