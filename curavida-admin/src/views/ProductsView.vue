<template>
  <div class="products-page">
    <div class="page-header">
      <div>
        <h1>Produtos</h1>
        <p>Gerencie os produtos cadastrados na CuraVida.</p>
      </div>

      <button class="primary-button" @click="openCreateModal">
        + Novo produto
      </button>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <input v-model="search" type="text" placeholder="Buscar produto..." />
      </div>

      <select v-model="categoryFilter" class="category-select">
        <option value="">Todas as categorias</option>

        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="state">
      <p>Carregando produtos...</p>
    </div>

    <div v-else-if="error" class="state error">
      <p>{{ error }}</p>

      <button @click="loadProducts">
        Tentar novamente
      </button>
    </div>

    <div v-else class="products-container">
      <div class="products-info">
        <span>
          {{ filteredProducts.length }} produto(s)
        </span>
      </div>

      <div v-if="filteredProducts.length" class="products-table">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Referência</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-name">
                  <div class="product-image">
                    <img v-if="product.images?.length" :src="product.images[0].url" :alt="product.name" />

                    <span v-else>
                      📦
                    </span>
                  </div>

                  <div>
                    <strong>{{ product.name }}</strong>

                    <small>
                      {{ product.brand || 'Sem marca' }}
                      <span v-if="product.size">
                        · {{ product.size }}
                      </span>
                    </small>
                  </div>
                </div>
              </td>

              <td>
                {{ product.reference }}
              </td>

              <td>
                {{ product.category?.name || 'Sem categoria' }}
              </td>

              <td>
                R$ {{ formatPrice(product.unitPrice) }}
              </td>

              <td>
                {{ product.stock }}
              </td>

              <td>
                <span class="status" :class="product.active ? 'active' : 'inactive'">
                  {{ product.active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <span>📦</span>

        <h3>Nenhum produto encontrado</h3>

        <p>
          Tente alterar sua busca ou filtro.
        </p>
      </div>
    </div>

    <!-- MODAL NOVO PRODUTO -->

    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal">

        <div class="modal-header">
          <div>
            <span class="modal-label">
              PRODUTOS
            </span>

            <h2>
              Novo produto
            </h2>
          </div>

          <button class="close-button" @click="closeCreateModal">
            ×
          </button>
        </div>

        <form @submit.prevent="createProduct">

          <div class="form-section">

            <h3>
              Informações básicas
            </h3>

            <div class="form-grid">

              <div class="form-group">
                <label>Nome *</label>

                <input v-model="productForm.name" type="text" placeholder="Nome do produto" />
              </div>

              <div class="form-group">
                <label>Referência *</label>

                <input v-model="productForm.reference" type="text" placeholder="Ex: PA 1723" />
              </div>

              <div class="form-group">
                <label>Slug *</label>

                <input v-model="productForm.slug" type="text" placeholder="slug-do-produto" />
              </div>

              <div class="form-group">
                <label>Categoria *</label>

                <select v-model="productForm.categoryId">
                  <option value="">
                    Selecione uma categoria
                  </option>

                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Marca</label>

                <input v-model="productForm.brand" type="text" placeholder="Ex: M-TEC" />
              </div>

              <div class="form-group">
                <label>Tamanho</label>

                <input v-model="productForm.size" type="text" placeholder="Ex: 10x10 cm" />
              </div>

            </div>

            <div class="form-group">
              <label>Descrição</label>

              <textarea v-model="productForm.description" rows="4" placeholder="Descrição do produto..."></textarea>
            </div>

          </div>

          <div class="form-section">

            <h3>
              Informações comerciais
            </h3>

            <div class="form-grid">

              <div class="form-group">
                <label>Quantidade por caixa</label>

                <input v-model="productForm.quantityPerBox" type="number" min="0" placeholder="Ex: 10" />
              </div>

              <div class="form-group">
                <label>Estoque</label>

                <input v-model="productForm.stock" type="number" min="0" placeholder="0" />
              </div>

              <div class="form-group">
                <label>Preço unitário *</label>

                <input v-model="productForm.unitPrice" type="number" min="0" step="0.01" placeholder="29.00" />
              </div>

              <div class="form-group">
                <label>Preço da caixa</label>

                <input v-model="productForm.boxPrice" type="number" min="0" step="0.01" placeholder="290.00" />
              </div>

            </div>

            <label class="checkbox-group">

              <input v-model="productForm.featured" type="checkbox" />

              <span>
                Produto em destaque
              </span>

            </label>

          </div>

          <div v-if="createError" class="form-error">
            {{ createError }}
          </div>

          <div class="modal-footer">

            <button type="button" class="cancel-button" :disabled="creatingProduct" @click="closeCreateModal">
              Cancelar
            </button>

            <button type="submit" class="save-button" :disabled="creatingProduct">
              {{ creatingProduct
                ? 'Cadastrando...'
                : 'Cadastrar produto'
              }}
            </button>

          </div>

        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import productService from '../services/product.service'
import categoryService from '../services/category.service'

const products = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const categoryFilter = ref('')

const categories = ref([])

const showCreateModal = ref(false)
const creatingProduct = ref(false)
const createError = ref('')

const productForm = ref({
  reference: '',
  name: '',
  slug: '',
  description: '',
  brand: '',
  size: '',
  quantityPerBox: '',
  unitPrice: '',
  boxPrice: '',
  stock: 0,
  featured: false,
  categoryId: '',
})

const loadCategories = async () => {
  try {
    const response = await categoryService.getAll()

    categories.value = response.data || []
  } catch (err) {
    console.error('Erro ao carregar categorias:', err)
  }
}

const openCreateModal = () => {
  createError.value = ''

  productForm.value = {
    reference: '',
    name: '',
    slug: '',
    description: '',
    brand: '',
    size: '',
    quantityPerBox: '',
    unitPrice: '',
    boxPrice: '',
    stock: 0,
    featured: false,
    categoryId: '',
  }

  showCreateModal.value = true
}

const closeCreateModal = () => {
  if (creatingProduct.value) return

  showCreateModal.value = false
}

const createProduct = async () => {
  createError.value = ''

  if (
    !productForm.value.reference ||
    !productForm.value.name ||
    !productForm.value.slug ||
    !productForm.value.unitPrice ||
    !productForm.value.categoryId
  ) {
    createError.value =
      'Preencha os campos obrigatórios.'

    return
  }

  try {
    creatingProduct.value = true

    await productService.create({
      reference: productForm.value.reference,
      name: productForm.value.name,
      slug: productForm.value.slug,
      description: productForm.value.description || null,
      brand: productForm.value.brand || null,
      size: productForm.value.size || null,

      quantityPerBox:
        productForm.value.quantityPerBox === ''
          ? null
          : Number(productForm.value.quantityPerBox),

      unitPrice: Number(productForm.value.unitPrice),

      boxPrice:
        productForm.value.boxPrice === ''
          ? null
          : Number(productForm.value.boxPrice),

      stock: Number(productForm.value.stock || 0),

      featured: productForm.value.featured,

      categoryId: productForm.value.categoryId,
    })

    showCreateModal.value = false

    await loadProducts()

  } catch (err) {
    console.error('Erro ao criar produto:', err)

    createError.value =
      err.response?.data?.message ||
      'Não foi possível cadastrar o produto.'

  } finally {
    creatingProduct.value = false
  }
}

const loadProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await productService.getAll()

    products.value = response.data || []
  } catch (err) {
    console.error(err)

    error.value =
      'Não foi possível carregar os produtos.'
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  const term = search.value.toLowerCase().trim()

  return products.value.filter((product) => {
    const matchesSearch =
      !term ||
      product.name?.toLowerCase().includes(term) ||
      product.reference?.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term)

    const matchesCategory =
      !categoryFilter.value ||
      product.category?.name === categoryFilter.value

    return matchesSearch && matchesCategory
  })
})

const formatPrice = (value) => {
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped>
.products-page {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0 0 6px;
  color: #111827;
  font-size: 28px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.primary-button {
  padding: 11px 18px;
  border: none;
  border-radius: 8px;
  background: #16a34a;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button:hover {
  background: #15803d;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box input,
.toolbar select {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  outline: none;
}

.toolbar select {
  width: 220px;
}

.category-select {
  width: 220px;
  height: 44px;
  padding: 0 42px 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}

.category-select:hover {
  border-color: #16a34a;
  background-color: #f9fafb;
}

.category-select:focus {
  border-color: #16a34a;

  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}

.category-select option {
  padding: 10px;
  color: #374151;
  background: #ffffff;
}

.search-box input:focus,
.toolbar select:focus {
  border-color: #16a34a;
}

.products-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.products-info {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 14px;
}

.products-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 14px 20px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
}

td {
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
  color: #374151;
  font-size: 14px;
}

.product-name {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
}

.product-image {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: #f3f4f6;
  font-size: 18px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name strong,
.product-name small {
  display: block;
}

.product-name strong {
  margin-bottom: 4px;
  color: #111827;
}

.product-name small {
  color: #9ca3af;
}

.status {
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status.active {
  background: #dcfce7;
  color: #166534;
}

.status.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #6b7280;
}

.state.error {
  flex-direction: column;
  gap: 12px;
  color: #dc2626;
}

.state button {
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  background: #ffffff;
  cursor: pointer;
}

.empty-state {
  padding: 70px 20px;
  text-align: center;
}

.empty-state>span {
  font-size: 36px;
}

.empty-state h3 {
  margin: 14px 0 6px;
  color: #374151;
}

.empty-state p {
  margin: 0;
  color: #9ca3af;
}

/* MODAL */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.45);
}

.modal {
  width: min(760px, 100%);
  max-height: 90vh;

  overflow-y: auto;

  border-radius: 16px;
  background: #ffffff;

  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 24px;

  border-bottom: 1px solid #e5e7eb;
}

.modal-label {
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
}

.modal-header h2 {
  margin: 5px 0 0;

  color: #111827;
  font-size: 22px;
}

.close-button {
  width: 34px;
  height: 34px;

  border: none;
  border-radius: 50%;

  background: #f3f4f6;

  color: #374151;
  font-size: 22px;

  cursor: pointer;
}

.form-section {
  padding: 24px;

  border-bottom: 1px solid #f3f4f6;
}

.form-section h3 {
  margin: 0 0 18px;

  color: #374151;
  font-size: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;

  padding: 10px 12px;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  background: #ffffff;

  color: #111827;
  font-family: inherit;
  font-size: 14px;

  outline: none;
}

.form-group input,
.form-group select {
  height: 42px;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #16a34a;

  box-shadow:
    0 0 0 3px rgba(22, 163, 74, 0.12);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #374151;
  font-size: 14px;

  cursor: pointer;
}

.checkbox-group input {
  width: 16px;
  height: 16px;
}

.form-error {
  margin: 20px 24px 0;
  padding: 12px;

  border-radius: 8px;

  background: #fee2e2;
  color: #991b1b;

  font-size: 13px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  padding: 20px 24px;
}

.cancel-button,
.save-button {
  padding: 10px 16px;

  border-radius: 8px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
}

.cancel-button {
  border: 1px solid #d1d5db;

  background: #ffffff;
  color: #374151;
}

.save-button {
  border: none;

  background: #16a34a;
  color: #ffffff;
}

.save-button:hover {
  background: #15803d;
}

.cancel-button:disabled,
.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
  }

  .toolbar {
    flex-direction: column;
  }

  .toolbar select {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
