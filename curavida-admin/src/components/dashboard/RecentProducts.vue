<template>
       <div class="recent-products">
              <div v-if="products.length" class="products-list">
                     <div v-for="product in products" :key="product.id" class="product-item">
                            <div class="product-image">
                                   <img v-if="product.images?.length" :src="product.images[0].url"
                                          :alt="product.name" />

                                   <span v-else>
                                          📦
                                   </span>
                            </div>

                            <div class="product-info">
                                   <strong>
                                          {{ product.name }}
                                   </strong>

                                   <span>
                                          {{ product.category?.name || t('products.noCategory') }}
                                   </span>
                            </div>

                            <div class="product-price">
                                   R$
                                   {{ formatPrice(product.unitPrice) }}
                            </div>
                     </div>
              </div>

              <div v-else class="empty-state">
                     <span>📦</span>

                     <strong>{{ t('dashboard.noProducts') }}</strong>

                     <p>
                            {{ t('dashboard.noProductsDesc') }}
                     </p>
              </div>
       </div>
</template>

<script setup>
import { t } from '../../i18n'

defineProps({
       products: {
              type: Array,
              default: () => [],
       },
})

const formatPrice = (value) => {
       return Number(value).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
       })
}
</script>

<style scoped>
.products-list {
       display: flex;
       flex-direction: column;
}

.product-item {
       display: flex;
       align-items: center;
       gap: 12px;

       padding: 13px 0;

       border-bottom: 1px solid #f3f4f6;
}

.product-item:last-child {
       border-bottom: none;
}

.product-image {
       width: 42px;
       height: 42px;

       display: flex;
       align-items: center;
       justify-content: center;

       flex-shrink: 0;

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

.product-info {
       flex: 1;
       min-width: 0;
}

.product-info strong,
.product-info span {
       display: block;

       overflow: hidden;

       white-space: nowrap;

       text-overflow: ellipsis;
}

.product-info strong {
       margin-bottom: 3px;

       color: #374151;

       font-size: 13px;
}

.product-info span {
       color: #9ca3af;

       font-size: 12px;
}

.product-price {
       color: #111827;

       font-size: 13px;
       font-weight: 600;

       white-space: nowrap;
}

.empty-state {
       min-height: 180px;

       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;

       text-align: center;
}

.empty-state>span {
       margin-bottom: 10px;

       font-size: 30px;
}

.empty-state strong {
       color: #374151;

       font-size: 14px;
}

.empty-state p {
       margin: 5px 0 0;

       color: #9ca3af;

       font-size: 12px;
}
</style>