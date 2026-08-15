<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">
        <span>Cura</span>Vida
      </div>

      <nav class="navigation">
        <RouterLink to="/">{{ t('nav.dashboard') }}</RouterLink>
        <RouterLink to="/produtos">{{ t('nav.products') }}</RouterLink>
        <RouterLink to="/categorias">{{ t('nav.categories') }}</RouterLink>
        <RouterLink to="/pedidos">{{ t('nav.orders') }}</RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <h1>{{ t('topbar.title') }}</h1>

        <button class="lang-button" :aria-label="t('topbar.lang')" @click="toggleLocale">
          {{ locale.value === 'pt' ? 'EN' : 'PT' }}
        </button>
      </header>

      <section class="page-content">
        <RouterView />
      </section>
    </main>

    <nav class="bottom-nav">
      <RouterLink to="/" class="bottom-link">
        <span class="bottom-icon">📊</span>
        <span class="bottom-label">{{ t('nav.dashboard') }}</span>
      </RouterLink>

      <RouterLink to="/produtos" class="bottom-link">
        <span class="bottom-icon">📦</span>
        <span class="bottom-label">{{ t('nav.products') }}</span>
      </RouterLink>

      <RouterLink to="/categorias" class="bottom-link">
        <span class="bottom-icon">🏷️</span>
        <span class="bottom-label">{{ t('nav.categories') }}</span>
      </RouterLink>

      <RouterLink to="/pedidos" class="bottom-link">
        <span class="bottom-icon">🛒</span>
        <span class="bottom-label">{{ t('nav.orders') }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { locale, t, toggleLocale } from '../i18n'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  background: #f5f7fa;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 16px;
  flex-shrink: 0;
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
  min-width: 0;
}

.topbar {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.topbar h1 {
  margin: 0;
  font-size: 20px;
}

.lang-button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #16a34a;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.lang-button:hover {
  border-color: #16a34a;
}

.page-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

.bottom-nav {
  display: none;
}

@media (max-width: 700px) {
  .sidebar {
    display: none;
  }

  .topbar {
    height: 60px;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .topbar h1 {
    font-size: 18px;
  }

  .page-content {
    padding: 20px 16px 96px;
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #ffffff;
    border-top: 1px solid #e5e7eb;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }

  .bottom-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 9px 4px;
    color: #9ca3af;
    text-decoration: none;
    font-size: 10px;
    font-weight: 600;
  }

  .bottom-icon {
    font-size: 20px;
  }

  .bottom-link.router-link-active {
    color: #16a34a;
  }
}
</style>