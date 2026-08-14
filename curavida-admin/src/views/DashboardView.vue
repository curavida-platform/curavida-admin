<template>
  <div class="dashboard">

    <div class="page-header">
      <div>
        <h1>Dashboard</h1>

        <p>
          Visão geral da plataforma CuraVida.
        </p>
      </div>

      <button class="refresh-button" :disabled="loading" @click="loadDashboard">
        ↻
        Atualizar
      </button>
    </div>

    <!-- LOADING -->

    <div v-if="loading" class="loading-state">
      <span>Carregando dashboard...</span>
    </div>

    <!-- DASHBOARD -->

    <template v-else>

      <!-- ESTATÍSTICAS -->

      <section class="stats-grid">

        <StatCard title="Produtos" :value="stats.products" icon="📦" description="Cadastrados" />

        <StatCard title="Categorias" :value="stats.categories" icon="🏷️" description="Cadastradas" />

        <StatCard title="Estoque baixo" :value="stats.lowStock" icon="⚠️" description="Precisam de atenção" />

        <StatCard title="Destaques" :value="stats.featured" icon="⭐" description="Produtos em destaque" />

      </section>

      <!-- CONTEÚDO -->

      <section class="dashboard-grid">

        <!-- PRODUTOS -->

        <div class="panel">

          <div class="panel-header">

            <div>
              <h2>
                Produtos recentes
              </h2>

              <p>
                Últimos produtos cadastrados.
              </p>
            </div>

            <RouterLink to="/admin/produtos">
              Ver produtos
            </RouterLink>

          </div>

          <RecentProducts :products="recentProducts" />

        </div>

        <!-- ACESSO RÁPIDO -->

        <div class="panel">

          <div class="panel-header">

            <div>
              <h2>
                Acesso rápido
              </h2>

              <p>
                Atalhos administrativos.
              </p>
            </div>

          </div>

          <QuickActions />

        </div>

      </section>

      <!-- ESTOQUE -->

      <section class="panel inventory-panel">

        <div class="panel-header">

          <div>
            <h2>
              Resumo do estoque
            </h2>

            <p>
              Situação atual dos produtos cadastrados.
            </p>
          </div>

          <RouterLink to="/admin/produtos">
            Gerenciar estoque
          </RouterLink>

        </div>

        <div class="inventory-grid">

          <div class="inventory-item">
            <span class="inventory-icon">
              🟢
            </span>

            <div>
              <strong>
                {{ stats.activeProducts }}
              </strong>

              <span>
                Produtos ativos
              </span>
            </div>
          </div>

          <div class="inventory-item">
            <span class="inventory-icon">
              ⚪
            </span>

            <div>
              <strong>
                {{ stats.inactiveProducts }}
              </strong>

              <span>
                Produtos inativos
              </span>
            </div>
          </div>

          <div class="inventory-item">
            <span class="inventory-icon">
              ⚠️
            </span>

            <div>
              <strong>
                {{ stats.lowStock }}
              </strong>

              <span>
                Estoque baixo
              </span>
            </div>
          </div>

          <div class="inventory-item">
            <span class="inventory-icon">
              📊
            </span>

            <div>
              <strong>
                {{ stats.totalStock }}
              </strong>

              <span>
                Unidades em estoque
              </span>
            </div>
          </div>

        </div>

      </section>

    </template>

    <!-- ERRO -->

    <div v-if="error" class="error-state">
      <strong>
        Não foi possível carregar o dashboard.
      </strong>

      <p>
        {{ error }}
      </p>

      <button @click="loadDashboard">
        Tentar novamente
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import StatCard from '../components/cards/StatCard.vue'
import RecentProducts from '../components/dashboard/RecentProducts.vue'
import QuickActions from '../components/dashboard/QuickActions.vue'

import productService from '../services/product.service'
import categoryService from '../services/category.service'

const products = ref([])
const categories = ref([])

const loading = ref(true)
const error = ref('')

const stats = computed(() => {
  const activeProducts = products.value.filter(
    product => product.active
  )

  const inactiveProducts = products.value.filter(
    product => !product.active
  )

  const lowStock = products.value.filter(
    product =>
      product.active &&
      Number(product.stock || 0) <= 5
  )

  const featured = products.value.filter(
    product =>
      product.active &&
      product.featured
  )

  const totalStock = products.value.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  )

  return {
    products: products.value.length,

    categories: categories.value.length,

    activeProducts: activeProducts.length,

    inactiveProducts: inactiveProducts.length,

    lowStock: lowStock.length,

    featured: featured.length,

    totalStock,
  }
})

const recentProducts = computed(() => {
  return [...products.value]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5)
})

const loadDashboard = async () => {
  loading.value = true
  error.value = ''

  try {
    const [
      productsResponse,
      categoriesResponse,
    ] = await Promise.all([
      productService.getAll(),
      categoryService.getAll(),
    ])

    products.value =
      productsResponse.data || []

    categories.value =
      categoriesResponse.data || []

  } catch (err) {
    console.error(
      'Erro ao carregar dashboard:',
      err
    )

    error.value =
      err.response?.data?.message ||
      'Verifique se a API do CuraVida está funcionando.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
.dashboard {
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

.refresh-button {
  display: flex;
  align-items: center;
  gap: 7px;

  padding: 9px 14px;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  background: #ffffff;

  color: #374151;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.refresh-button:hover {
  border-color: #16a34a;

  color: #15803d;
}

.refresh-button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}

.stats-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 20px;

  margin-bottom: 24px;
}

.dashboard-grid {
  display: grid;

  grid-template-columns:
    2fr 1fr;

  gap: 24px;

  margin-bottom: 24px;
}

.panel {
  padding: 24px;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 12px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0 0 5px;

  color: #111827;

  font-size: 18px;
}

.panel-header p {
  margin: 0;

  color: #6b7280;

  font-size: 13px;
}

.panel-header a {
  color: #16a34a;

  font-size: 13px;
  font-weight: 600;

  text-decoration: none;

  white-space: nowrap;
}

.panel-header a:hover {
  color: #15803d;
}

.inventory-panel {
  margin-bottom: 24px;
}

.inventory-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 14px;
}

.inventory-item {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 16px;

  border: 1px solid #f3f4f6;

  border-radius: 10px;

  background: #f9fafb;
}

.inventory-icon {
  font-size: 20px;
}

.inventory-item strong,
.inventory-item span {
  display: block;
}

.inventory-item strong {
  margin-bottom: 3px;

  color: #111827;

  font-size: 18px;
}

.inventory-item div span {
  color: #6b7280;

  font-size: 12px;
}

.loading-state {
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e5e7eb;

  border-radius: 12px;

  background: #ffffff;

  color: #6b7280;

  font-size: 14px;
}

.error-state {
  margin-top: 20px;

  padding: 20px;

  border: 1px solid #fecaca;

  border-radius: 10px;

  background: #fef2f2;

  color: #991b1b;
}

.error-state strong {
  display: block;

  margin-bottom: 5px;
}

.error-state p {
  margin: 0 0 14px;

  color: #b91c1c;

  font-size: 13px;
}

.error-state button {
  padding: 8px 14px;

  border: 1px solid #fca5a5;

  border-radius: 7px;

  background: #ffffff;

  color: #991b1b;

  cursor: pointer;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .inventory-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .inventory-grid {
    grid-template-columns: 1fr;
  }

  .panel {
    padding: 18px;
  }
}
</style>