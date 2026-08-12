<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Visão geral da plataforma CuraVida.</p>
      </div>
    </div>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>

        <div>
          <span>Produtos</span>
          <strong>0</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🛒</div>

        <div>
          <span>Pedidos</span>
          <strong>0</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⏳</div>

        <div>
          <span>Pendentes</span>
          <strong>0</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏷️</div>

        <div>
          <span>Categorias</span>
          <strong>0</strong>
        </div>
      </div>
    </section>

    <section class="dashboard-grid">
      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>Pedidos recentes</h2>
            <p>Últimos pedidos realizados.</p>
          </div>

          <RouterLink to="/admin/pedidos">
            Ver pedidos
          </RouterLink>
        </div>

        <div class="empty-state">
          <span class="empty-icon">📋</span>

          <h3>Nenhum pedido ainda</h3>

          <p>
            Quando novos pedidos forem realizados,
            eles aparecerão aqui.
          </p>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>Acesso rápido</h2>
            <p>Atalhos administrativos.</p>
          </div>
        </div>

        <div class="quick-actions">
          <RouterLink to="/admin/pedidos" class="quick-action">
            <span>🛒</span>

            <div>
              <strong>Pedidos</strong>
              <small>Gerenciar pedidos</small>
            </div>
          </RouterLink>

          <button class="quick-action" disabled>
            <span>📦</span>

            <div>
              <strong>Produtos</strong>
              <small>Em breve</small>
            </div>
          </button>

          <button class="quick-action" disabled>
            <span>🏷️</span>

            <div>
              <strong>Categorias</strong>
              <small>Em breve</small>
            </div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

.page-header {
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 28px;
  color: #111827;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecfdf5;
  border-radius: 10px;
  font-size: 22px;
}

.stat-card span {
  display: block;
  margin-bottom: 4px;
  color: #6b7280;
  font-size: 14px;
}

.stat-card strong {
  display: block;
  color: #111827;
  font-size: 24px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.panel-header h2 {
  margin: 0 0 5px;
  color: #111827;
  font-size: 18px;
}

.panel-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.panel-header a {
  color: #16a34a;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.empty-state {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 30px;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.empty-state h3 {
  margin: 0 0 6px;
  color: #374151;
  font-size: 16px;
}

.empty-state p {
  max-width: 320px;
  margin: 0;
  color: #9ca3af;
  font-size: 14px;
  line-height: 1.5;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-action {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
}

.quick-action:not(:disabled):hover {
  border-color: #16a34a;
  background: #f0fdf4;
}

.quick-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-action > span {
  font-size: 20px;
}

.quick-action strong,
.quick-action small {
  display: block;
}

.quick-action strong {
  color: #374151;
  margin-bottom: 3px;
}

.quick-action small {
  color: #9ca3af;
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>