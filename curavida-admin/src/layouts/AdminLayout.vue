<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">
        <span>Cura</span>Vida
      </div>

      <nav class="navigation">
        <RouterLink to="/">
          Dashboard
        </RouterLink>

        <RouterLink to="/produtos">
          Produtos
        </RouterLink>

        <RouterLink to="/categorias">
          Categorias
        </RouterLink>

        <RouterLink to="/pedidos">
          Pedidos
        </RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <h1>Painel Administrativo</h1>
      </header>

      <section class="page-content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  background: #f5f7fa;
}

.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 16px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
}

.logo span {
  color: #16a34a;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.navigation a {
  padding: 12px 14px;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  transition: 0.2s;
}

.navigation a:hover,
.navigation a.router-link-active {
  background: #ecfdf5;
  color: #16a34a;
}

.main-content {
  flex: 1;
}

.topbar {
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.topbar h1 {
  margin: 0;
  font-size: 20px;
}

.page-content {
  padding: 32px;
}
</style>