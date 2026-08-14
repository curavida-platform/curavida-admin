<template>
       <div class="stat-card">
              <div class="stat-icon">
                     {{ icon }}
              </div>

              <div class="stat-content">
                     <span>{{ title }}</span>

                     <strong>{{ value }}</strong>

                     <small v-if="description">
                            {{ description }}
                     </small>
              </div>
       </div>
</template>

<script setup>
defineProps({
       title: {
              type: String,
              required: true,
       },

       value: {
              type: [String, Number],
              default: 0,
       },

       icon: {
              type: String,
              default: '📦',
       },

       description: {
              type: String,
              default: '',
       },
})
</script>

<style scoped>
.stat-card {
       display: flex;
       align-items: center;
       gap: 16px;

       padding: 20px;

       background: #ffffff;

       border: 1px solid #e5e7eb;
       border-radius: 12px;

       transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;
}

.stat-card:hover {
       transform: translateY(-2px);

       box-shadow:
              0 8px 20px rgba(0, 0, 0, 0.05);
}

.stat-icon {
       width: 48px;
       height: 48px;

       flex-shrink: 0;

       display: flex;
       align-items: center;
       justify-content: center;

       border-radius: 10px;

       background: #ecfdf5;

       font-size: 22px;
}

.stat-content {
       min-width: 0;
}

.stat-content span {
       display: block;

       margin-bottom: 3px;

       color: #6b7280;

       font-size: 13px;
}

.stat-content strong {
       display: block;

       color: #111827;

       font-size: 24px;
       line-height: 1.2;
}

.stat-content small {
       display: block;

       margin-top: 3px;

       color: #9ca3af;

       font-size: 11px;
}
</style>