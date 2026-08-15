<script setup>
import { onMounted, ref } from 'vue'
import orderService from '../services/order.service'

import { t } from '../i18n'

const orders = ref([])
const loading = ref(true)
const error = ref('')

const selectedOrder = ref(null)
const loadingDetails = ref(false)

const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await orderService.getAll()

    orders.value = response.data || []
  } catch (err) {
    console.error(err)
    error.value = t('orders.error')
  } finally {
    loading.value = false
  }
}

const openOrder = async (id) => {
  loadingDetails.value = true
  selectedOrder.value = null

  try {
    const response = await orderService.getById(id)

    selectedOrder.value = response.data
  } catch (err) {
    console.error(err)
    alert(t('orders.details.detailsError'))
  } finally {
    loadingDetails.value = false
  }
}

const closeOrder = () => {
  selectedOrder.value = null
}

const formatDate = (date) => {
  if (!date) return '—'

  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatPrice = (value) => {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const getStatusLabel = (status) => {
  const labels = {
    PENDING: t('orders.status.PENDING'),
    APPROVED: t('orders.status.APPROVED'),
    REJECTED: t('orders.status.REJECTED'),
    COMPLETED: t('orders.status.COMPLETED'),
  }

  return labels[status] || status
}

const getStatusClass = (status) => {
  return {
    pending: status === 'PENDING',
    approved: status === 'APPROVED',
    rejected: status === 'REJECTED',
    completed: status === 'COMPLETED',
  }
}

onMounted(() => {
  loadOrders()
})

const updatingStatus = ref(false)

const updateStatus = async (status) => {
  if (!selectedOrder.value) return

  try {
    updatingStatus.value = true

    const response = await orderService.updateStatus(
      selectedOrder.value.id,
      status,
    )

    selectedOrder.value = response.data

    await loadOrders()
  } catch (err) {
    console.error(err)

    alert(
      err.response?.data?.message ||
      t('orders.details.statusError')
    )
  } finally {
    updatingStatus.value = false
  }
}
</script>

<template>
  <div class="orders-page">

    <!-- CABEÇALHO -->

    <div class="page-header">
      <div>
        <h1>{{ t('orders.title') }}</h1>

        <p>
          {{ t('orders.subtitle') }}
        </p>
      </div>
    </div>

    <!-- LOADING -->

    <div v-if="loading" class="state">
      <p>{{ t('orders.loading') }}</p>
    </div>

    <!-- ERRO -->

    <div v-else-if="error" class="state error">
      <p>{{ error }}</p>

      <button @click="loadOrders">
        {{ t('actions.retry') }}
      </button>
    </div>

    <!-- PEDIDOS -->

    <div v-else class="orders-container">

      <div class="orders-info">
        <span>
          {{ t('orders.count', { count: orders.length }) }}
        </span>
      </div>

      <!-- TABELA -->

      <div v-if="orders.length" class="orders-table">

        <table>

          <thead>
            <tr>
              <th>{{ t('orders.table.customer') }}</th>
              <th>{{ t('orders.table.phone') }}</th>
              <th>{{ t('orders.table.items') }}</th>
              <th>{{ t('orders.table.status') }}</th>
              <th>{{ t('orders.table.date') }}</th>
              <th>{{ t('orders.table.actions') }}</th>
            </tr>
          </thead>

          <tbody>

            <tr v-for="order in orders" :key="order.id">

              <td data-label="Cliente">
                <strong>
                  {{ order.customerName }}
                </strong>
              </td>

              <td data-label="Telefone">
                {{ order.customerPhone || '—' }}
              </td>

              <td data-label="Itens">
                {{ order.items?.length || 0 }}
              </td>

              <td data-label="Status">

                <span class="status" :class="getStatusClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>

              </td>

              <td data-label="Data">
                {{ formatDate(order.createdAt) }}
              </td>

              <td data-label="Ações">

                <button class="details-button" @click="openOrder(order.id)">
                  {{ t('actions.details') }}
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

      <!-- VAZIO -->

      <div v-else class="empty-state">

        <span>📋</span>

        <h3>
          {{ t('orders.emptyTitle') }}
        </h3>

        <p>
          {{ t('orders.emptyDesc') }}
        </p>

      </div>

    </div>

    <!-- MODAL -->

    <div v-if="selectedOrder || loadingDetails" class="modal-overlay" @click.self="closeOrder">

      <div class="modal">

        <!-- CARREGANDO -->

        <div v-if="loadingDetails" class="modal-loading">
          {{ t('orders.details.loading') }}
        </div>

        <!-- DETALHES -->

        <template v-else-if="selectedOrder">

          <div class="modal-header">

            <div>

              <span class="modal-label">
                {{ t('orders.details.subject') }}
              </span>

              <h2>
                #{{ selectedOrder.id.slice(0, 8) }}
              </h2>

            </div>

            <button class="close-button" @click="closeOrder">
              ×
            </button>

          </div>

          <!-- CLIENTE -->

          <section class="details-section">

            <h3>
              {{ t('orders.details.customer') }}
            </h3>

            <div class="customer-info">

              <div>
                <span>{{ t('orders.details.name') }}</span>
                <strong>
                  {{ selectedOrder.customerName }}
                </strong>
              </div>

              <div>
                <span>{{ t('orders.details.phone') }}</span>
                <strong>
                  {{ selectedOrder.customerPhone || '—' }}
                </strong>
              </div>

              <div>
                <span>{{ t('orders.details.email') }}</span>
                <strong>
                  {{ selectedOrder.customerEmail || '—' }}
                </strong>
              </div>

              <div>
                <span>{{ t('orders.details.date') }}</span>
                <strong>
                  {{ formatDate(selectedOrder.createdAt) }}
                </strong>
              </div>

            </div>

          </section>

          <!-- STATUS -->

          <section class="details-section">

            <h3>
              {{ t('orders.details.status') }}
            </h3>

            <span class="status" :class="getStatusClass(selectedOrder.status)">
              {{ getStatusLabel(selectedOrder.status) }}
            </span>

            <div class="status-actions">

              <button v-if="selectedOrder.status === 'PENDING'" class="approve-button" :disabled="updatingStatus"
                @click="updateStatus('APPROVED')">
                {{ t('orders.details.approve') }}
              </button>

              <button v-if="selectedOrder.status === 'PENDING'" class="reject-button" :disabled="updatingStatus"
                @click="updateStatus('REJECTED')">
                {{ t('orders.details.reject') }}
              </button>

              <button v-if="selectedOrder.status === 'APPROVED'" class="complete-button" :disabled="updatingStatus"
                @click="updateStatus('COMPLETED')">
                {{ t('orders.details.complete') }}
              </button>

            </div>

          </section>

          <!-- PRODUTOS -->

          <section class="details-section">

            <h3>
              {{ t('orders.details.products') }}
            </h3>

            <div class="products-list">

              <div v-for="item in selectedOrder.items" :key="item.id" class="order-product">

                <div class="product-info">

                  <strong>
                    {{ item.product.name }}
                  </strong>

                  <span>
                    Ref: {{ item.product.reference }}
                  </span>

                </div>

                <div class="product-quantity">
                  x{{ item.quantity }}
                </div>

                <div class="product-price">
                  {{ formatPrice(item.unitPrice) }}
                </div>

              </div>

            </div>

          </section>

          <!-- OBSERVAÇÃO -->

          <section v-if="selectedOrder.notes" class="details-section">

            <h3>
              {{ t('orders.details.notes') }}
            </h3>

            <p class="notes">
              {{ selectedOrder.notes }}
            </p>

          </section>

          <div class="modal-footer">

            <button class="close-modal-button" @click="closeOrder">
              {{ t('actions.close') }}
            </button>

          </div>

        </template>

      </div>

    </div>

  </div>
</template>

<style scoped>
.orders-page {
  width: 100%;
  max-width: 100%;
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

.details-button {
  padding: 8px 13px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
}

.details-button:hover {
  border-color: #16a34a;
  color: #16a34a;
}

/* STATUS */

.status {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.approved {
  background: #dcfce7;
  color: #166534;
}

.status.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.status.completed {
  background: #dbeafe;
  color: #1e40af;
}

.status-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.status-actions button {
  padding: 9px 14px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.approve-button {
  background: #dcfce7;
  color: #166534;
}

.approve-button:hover {
  background: #bbf7d0;
}

.reject-button {
  background: #fee2e2;
  color: #991b1b;
}

.reject-button:hover {
  background: #fecaca;
}

.complete-button {
  background: #dbeafe;
  color: #1e40af;
}

.complete-button:hover {
  background: #bfdbfe;
}

.status-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ESTADOS */

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
  width: min(700px, 100%);
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

  font-size: 22px;
  cursor: pointer;
}

.details-section {
  padding: 22px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.details-section h3 {
  margin: 0 0 15px;
  color: #374151;
  font-size: 14px;
}

.customer-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.customer-info div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-info span {
  color: #9ca3af;
  font-size: 12px;
}

.customer-info strong {
  color: #111827;
  font-size: 14px;
}

.products-list {
  display: flex;
  flex-direction: column;
}

.order-product {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 20px;

  padding: 14px 0;

  border-bottom: 1px solid #f3f4f6;
}

.order-product:last-child {
  border-bottom: none;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-info strong {
  color: #111827;
  font-size: 14px;
}

.product-info span {
  color: #9ca3af;
  font-size: 12px;
}

.product-quantity {
  color: #6b7280;
  font-size: 13px;
}

.product-price {
  color: #16a34a;
  font-weight: 600;
}

.notes {
  margin: 0;
  padding: 12px;

  border-radius: 8px;

  background: #f9fafb;

  color: #4b5563;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 24px;
}

.close-modal-button {
  padding: 9px 18px;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  background: #ffffff;

  color: #374151;
  font-weight: 600;

  cursor: pointer;
}

.modal-loading {
  padding: 80px 20px;
  text-align: center;
  color: #6b7280;
}

/* RESPONSIVO */

@media (max-width: 700px) {

  .orders-info {
    padding: 12px 16px;
  }

  .orders-table {
    overflow: visible;
  }

  .orders-table table,
  .orders-table thead,
  .orders-table tbody {
    display: block;
    width: 100%;
  }

  .orders-table thead {
    display: none;
  }

  .orders-table tr {
    display: grid;
    grid-template-columns: 1fr;
    min-width: 0;
    width: 100%;
    gap: 12px;
    padding: 14px 16px;
    border-top: 1px solid #e5e7eb;
  }

  .orders-table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0;
    border-top: none;
    text-align: right;
    min-width: 0;
  }

  .orders-table td[data-label]::before {
    content: attr(data-label);
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .orders-table td > * {
    min-width: 0;
  }

  .orders-table td:first-child {
    justify-content: flex-start;
    text-align: left;
  }

  .customer-info {
    grid-template-columns: 1fr;
  }

  .order-product {
    grid-template-columns: 1fr auto;
  }

  .product-price {
    grid-column: 2;
  }

  .modal-overlay {
    padding: 0;
    align-items: stretch;
  }

  .modal {
    width: 100%;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }

  .modal-header {
    padding: 18px;
  }

  .details-section {
    padding: 18px;
  }

  .status-actions {
    flex-direction: column;
  }

  .status-actions button {
    width: 100%;
  }

  .modal-footer {
    padding: 16px 18px;
  }

}
</style>