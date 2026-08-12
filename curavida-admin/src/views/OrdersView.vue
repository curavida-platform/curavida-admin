<template>
  <div class="orders-page">
    <div class="page-header">
      <div>
        <h1>Pedidos</h1>
        <p>Gerencie os pedidos recebidos pela CuraVida.</p>
      </div>
    </div>

    <div v-if="loading" class="state">
      <p>Carregando pedidos...</p>
    </div>

    <div v-else-if="error" class="state error">
      <p>{{ error }}</p>

      <button @click="loadOrders">
        Tentar novamente
      </button>
    </div>

    <div v-else class="orders-container">
      <div class="orders-info">
        <span>
          {{ orders.length }} pedido(s)
        </span>
      </div>

      <div v-if="orders.length" class="orders-table">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Itens</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
            >
              <td>
                <strong>{{ order.customerName }}</strong>
              </td>

              <td>
                {{ order.customerEmail || '—' }}
              </td>

              <td>
                {{ order.customerPhone || '—' }}
              </td>

              <td>
                {{ order.items?.length || 0 }}
              </td>

              <td>
                {{ formatDate(order.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <span>📋</span>

        <h3>Nenhum pedido encontrado</h3>

        <p>
          Os pedidos realizados pelos clientes aparecerão aqui.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import orderService from '../services/order.service'

const orders = ref([])
const loading = ref(true)
const error = ref('')

const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await orderService.getAll()

    orders.value = response.data || []
  } catch (err) {
    console.error(err)

    error.value = 'Não foi possível carregar os pedidos.'
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) {
    return '—'
  }

  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.orders-page {
  width: 100%;
}

.page-header {
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

.orders-container {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.orders-info {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 14px;
}

.orders-table {
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

td strong {
  color: #111827;
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

.empty-state > span {
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
</style>