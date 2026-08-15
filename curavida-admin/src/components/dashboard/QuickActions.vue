<template>
       <div class="quick-actions">

              <RouterLink to="/produtos" class="quick-action">
                     <span class="icon">📦</span>

                     <div>
                            <strong>{{ t('nav.products') }}</strong>

                            <small>
                                   {{ t('dashboard.quick.manageProducts') }}
                            </small>
                     </div>
              </RouterLink>

              <RouterLink to="/categorias" class="quick-action">
                     <span class="icon">🏷️</span>

                     <div>
                            <strong>{{ t('nav.categories') }}</strong>

                            <small>
                                   {{ t('dashboard.quick.manageCategories') }}
                            </small>
                     </div>
              </RouterLink>

              <RouterLink to="/pedidos" class="quick-action">
                     <span class="icon">🛒</span>

                     <div>
                            <strong>{{ t('nav.orders') }}</strong>

                            <small>
                                   {{ t('dashboard.quick.manageOrders') }}
                            </small>
                     </div>
              </RouterLink>

       </div>
</template>

<script setup>
import { t } from '../../i18n'
</script>

<style scoped>
.quick-actions {
       display: flex;
       flex-direction: column;
       gap: 10px;
}

.quick-action {
       display: flex;
       align-items: center;
       gap: 14px;

       padding: 14px;

       border: 1px solid #e5e7eb;
       border-radius: 10px;

       background: #ffffff;

       text-decoration: none;

       transition:
              border-color 0.2s ease,
              background 0.2s ease;
}

.quick-action:hover {
       border-color: #16a34a;

       background: #f0fdf4;
}

.icon {
       width: 38px;
       height: 38px;

       display: flex;
       align-items: center;
       justify-content: center;

       border-radius: 8px;

       background: #f3f4f6;

       font-size: 18px;
}

.quick-action strong,
.quick-action small {
       display: block;
}

.quick-action strong {
       margin-bottom: 3px;

       color: #374151;

       font-size: 13px;
}

.quick-action small {
       color: #9ca3af;

       font-size: 12px;
}
</style>