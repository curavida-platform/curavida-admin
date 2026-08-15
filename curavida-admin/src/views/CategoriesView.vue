<script setup>
import { onMounted, ref } from 'vue'
import categoryService from '../services/category.service'

import { t } from '../i18n'

const categories = ref([])
const loading = ref(true)
const error = ref('')

const showModal = ref(false)
const editingCategory = ref(null)
const saving = ref(false)

const form = ref({
       name: '',
       description: '',
       icon: '',
})

const loadCategories = async () => {
       loading.value = true
       error.value = ''

       try {
              const response = await categoryService.getAll()

              categories.value = response.data || []
       } catch (err) {
              console.error(err)
              error.value = t('categories.error')
       } finally {
              loading.value = false
       }
}

const openCreateModal = () => {
       editingCategory.value = null

       form.value = {
              name: '',
              description: '',
              icon: '',
       }

       showModal.value = true
}

const openEditModal = (category) => {
       editingCategory.value = category

       form.value = {
              name: category.name || '',
              description: category.description || '',
              icon: category.icon || '',
       }

       showModal.value = true
}

const closeModal = () => {
       if (saving.value) return

       showModal.value = false
       editingCategory.value = null
}

const saveCategory = async () => {
       if (!form.value.name.trim()) {
              alert(t('categories.modal.nameRequired'))
              return
       }

       try {
              saving.value = true

              const data = {
                     name: form.value.name.trim(),
                     description: form.value.description.trim() || null,
                     icon: form.value.icon.trim() || null,
              }

              if (editingCategory.value) {
                     await categoryService.update(
                            editingCategory.value.id,
                            data,
                     )
              } else {
                     await categoryService.create(data)
              }

              closeModal()
              await loadCategories()
       } catch (err) {
              console.error(err)

              alert(
                     err.response?.data?.message ||
                     err.message ||
                     t('categories.modal.saveError'),
              )
       } finally {
              saving.value = false
       }
}

const toggleStatus = async (category) => {
       const action = category.active
              ? 'deactivate'
              : 'activate'

       const confirmed = confirm(
              t(`categories.modal.${action}Confirm`, { name: category.name }),
       )

       if (!confirmed) return

       try {
              await categoryService.updateStatus(
                     category.id,
                     !category.active,
              )

              await loadCategories()
       } catch (err) {
              console.error(err)

              alert(
                     err.response?.data?.message ||
                     t('categories.modal.statusError'),
              )
       }
}

const deleteCategory = async (category) => {
       const confirmed = confirm(
              t('categories.modal.deleteConfirm', { name: category.name }),
       )

       if (!confirmed) return

       try {
              await categoryService.remove(category.id)

              await loadCategories()
       } catch (err) {
              console.error(err)

              alert(
                     err.response?.data?.message ||
                     t('categories.modal.deleteError'),
              )
       }
}

onMounted(() => {
       loadCategories()
})
</script>

<template>
       <div class="categories-page">

              <!-- CABEÇALHO -->

              <div class="page-header">

                     <div>
                            <h1>{{ t('categories.title') }}</h1>

                            <p>
                                   {{ t('categories.subtitle') }}
                            </p>
                     </div>

                     <button class="create-button" @click="openCreateModal">
                            {{ t('categories.newButton') }}
                     </button>

              </div>

              <!-- LOADING -->

              <div v-if="loading" class="state">
                     <p>{{ t('categories.loading') }}</p>
              </div>

              <!-- ERRO -->

              <div v-else-if="error" class="state error">
                     <p>{{ error }}</p>

                     <button @click="loadCategories">
                            {{ t('actions.retry') }}
                     </button>
              </div>

              <!-- CONTEÚDO -->

              <div v-else class="categories-container">

                     <div class="categories-info">
                            <span>
                                   {{ t('categories.count', { count: categories.length }) }}
                            </span>
                     </div>

                     <!-- TABELA -->

                     <div v-if="categories.length" class="categories-table">

                            <table>

<thead>
                                           <tr>
                                                  <th>{{ t('categories.table.category') }}</th>
                                                  <th>{{ t('categories.table.description') }}</th>
                                                  <th>{{ t('categories.table.products') }}</th>
                                                  <th>{{ t('categories.table.status') }}</th>
                                                  <th>{{ t('categories.table.actions') }}</th>
                                           </tr>
                                    </thead>

                                   <tbody>

                                          <tr v-for="category in categories" :key="category.id">

                                                 <!-- CATEGORIA -->

                                                 <td data-label="Categoria">

                                                        <div class="category-name">

                                                               <div class="category-icon">
                                                                      {{ category.icon || '📁' }}
                                                               </div>

                                                               <div>
                                                                      <strong>
                                                                             {{ category.name }}
                                                                      </strong>

                                                                      <span>
                                                                             {{ category.slug }}
                                                                      </span>
                                                               </div>

                                                        </div>

                                                 </td>

                                                 <!-- DESCRIÇÃO -->

                                                 <td data-label="Descrição">
                                                        <span class="description">
                                                               {{ category.description || '—' }}
                                                        </span>
                                                 </td>

                                                 <!-- PRODUTOS -->

                                                 <td data-label="Produtos">

                                                        <span class="product-count">
                                                               {{ category._count?.products || 0 }}
                                                        </span>

                                                 </td>

                                                 <!-- STATUS -->

                                                 <td data-label="Status">

                                                        <span class="status" :class="{
                                                               active: category.active,
                                                               inactive: !category.active,
                                                        }">
                                                               {{ category.active ? t('categories.status.active') : t('categories.status.inactive') }}
                                                        </span>

                                                 </td>

                                                 <!-- AÇÕES -->

                                                 <td data-label="Ações">

                                                        <div class="actions">

                                                               <button class="edit-button"
                                                                      @click="openEditModal(category)">
                                                                      {{ t('categories.actions.edit') }}
                                                               </button>

                                                               <button class="status-button"
                                                                      @click="toggleStatus(category)">
                                                                      {{ category.active ? t('categories.actions.deactivate') : t('categories.actions.activate') }}
                                                               </button>

                                                               <button v-if="!category._count?.products"
                                                                      class="delete-button"
                                                                      @click="deleteCategory(category)">
                                                                      {{ t('categories.actions.delete') }}
                                                               </button>

                                                        </div>

                                                 </td>

                                          </tr>

                                   </tbody>

                            </table>

                     </div>

                     <!-- VAZIO -->

                     <div v-else class="empty-state">

                            <span>📂</span>

                            <h3>
                                   {{ t('categories.emptyTitle') }}
                            </h3>

                            <p>
                                   {{ t('categories.emptyDesc') }}
                            </p>

                            <button class="create-empty-button" @click="openCreateModal">
                                   {{ t('categories.createEmpty') }}
                            </button>

                     </div>

              </div>

              <!-- FAB -->

              <button class="fab" aria-label="Novo" @click="openCreateModal">+</button>

              <!-- MODAL -->

              <div v-if="showModal" class="modal-overlay" @click.self="closeModal">

                     <div class="modal">

                            <!-- CABEÇALHO -->

                            <div class="modal-header">

                                   <div>
                                          <span class="modal-label">
                                                 {{ editingCategory ? t('categories.modal.editLabel') : t('categories.modal.newLabel') }}
                                          </span>

                                          <h2>
                                                 {{ editingCategory
                                                        ? t('categories.modal.editTitle')
                                                 : t('categories.modal.newTitle')
                                                 }}
                                          </h2>
                                   </div>

                                   <button class="close-button" @click="closeModal">
                                          ×
                                   </button>

                            </div>

                            <!-- FORMULÁRIO -->

                            <form class="category-form" @submit.prevent="saveCategory">

                                   <div class="form-group">

                                          <label>
                                                 {{ t('categories.modal.name') }}
                                          </label>

                                          <input v-model="form.name" type="text" :placeholder="t('categories.modal.namePlaceholder')"
                                                 maxlength="100" required />

                                   </div>

                                   <div class="form-group">

                                          <label>
                                                 {{ t('categories.modal.description') }}
                                          </label>

                                          <textarea v-model="form.description" :placeholder="t('categories.modal.descriptionPlaceholder')"
                                                 rows="4"></textarea>

                                   </div>

                                   <div class="form-group">

                                          <label>
                                                 {{ t('categories.modal.icon') }}
                                          </label>

                                          <input v-model="form.icon" type="text" :placeholder="t('categories.modal.iconPlaceholder')" maxlength="50" />

                                          <span class="form-help">
                                                 {{ t('categories.modal.iconHelp') }}
                                          </span>

                                   </div>

                                   <!-- BOTÕES -->

                                   <div class="modal-footer">

                                          <button type="button" class="cancel-button" :disabled="saving"
                                                 @click="closeModal">
                                                 {{ t('actions.cancel') }}
                                          </button>

                                          <button type="submit" class="save-button" :disabled="saving">
                                                 {{ saving
                                                        ? t('categories.modal.saving')
                                                        : editingCategory
                                                 ? t('categories.modal.saveEdit')
                                                 : t('categories.modal.saveCreate')
                                                 }}
                                          </button>

                                   </div>

                            </form>

                     </div>

              </div>

       </div>
</template>

<style scoped>
.categories-page {
       width: 100%;
       max-width: 100%;
}

.fab {
       display: none;
}

/* CABEÇALHO */

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

.create-button,
.create-empty-button {
       padding: 10px 16px;
       border: none;
       border-radius: 8px;
       background: #16a34a;
       color: #ffffff;
       font-size: 14px;
       font-weight: 600;
       cursor: pointer;
}

.create-button:hover,
.create-empty-button:hover {
       background: #15803d;
}

/* CONTAINER */

.categories-container {
       overflow: hidden;
       background: #ffffff;
       border: 1px solid #e5e7eb;
       border-radius: 12px;
}

.categories-info {
       padding: 16px 20px;
       border-bottom: 1px solid #e5e7eb;
       color: #6b7280;
       font-size: 14px;
}

/* TABELA */

.categories-table {
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

/* CATEGORIA */

.category-name {
       display: flex;
       align-items: center;
       gap: 12px;
}

.category-icon {
       display: flex;
       align-items: center;
       justify-content: center;

       width: 38px;
       height: 38px;

       border-radius: 9px;

       background: #f0f7f7;

       font-size: 18px;
}

.category-name>div:last-child {
       display: flex;
       flex-direction: column;
       gap: 3px;
}

.category-name span {
       color: #9ca3af;
       font-size: 12px;
}

.description {
       display: block;
       max-width: 250px;
       overflow: hidden;
       color: #6b7280;
       text-overflow: ellipsis;
       white-space: nowrap;
}

.product-count {
       font-weight: 600;
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

.status.active {
       background: #dcfce7;
       color: #166534;
}

.status.inactive {
       background: #f3f4f6;
       color: #6b7280;
}

/* AÇÕES */

.actions {
       display: flex;
       align-items: center;
       gap: 7px;
}

.actions button {
       padding: 7px 10px;
       border-radius: 7px;
       font-size: 12px;
       cursor: pointer;
}

.edit-button {
       border: 1px solid #d1d5db;
       background: #ffffff;
       color: #374151;
}

.edit-button:hover {
       border-color: #16a34a;
       color: #16a34a;
}

.status-button {
       border: 1px solid #d1d5db;
       background: #ffffff;
       color: #6b7280;
}

.status-button:hover {
       border-color: #16a34a;
       color: #16a34a;
}

.delete-button {
       border: 1px solid #fecaca;
       background: #ffffff;
       color: #dc2626;
}

.delete-button:hover {
       background: #fee2e2;
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

/* VAZIO */

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
       margin: 0 0 20px;
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
       width: min(520px, 100%);
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
       font-size: 21px;
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

.close-button:hover {
       background: #e5e7eb;
}

/* FORMULÁRIO */

.category-form {
       padding: 24px;
}

.form-group {
       display: flex;
       flex-direction: column;
       gap: 7px;
       margin-bottom: 18px;
}

.form-group label {
       color: #374151;
       font-size: 13px;
       font-weight: 600;
}

.form-group input,
.form-group textarea {
       width: 100%;
       box-sizing: border-box;

       padding: 10px 12px;

       border: 1px solid #d1d5db;
       border-radius: 8px;

       outline: none;

       background: #ffffff;

       color: #111827;

       font-family: inherit;
       font-size: 14px;

       resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
       border-color: #16a34a;
}

.form-help {
       color: #9ca3af;
       font-size: 11px;
}

/* FOOTER */

.modal-footer {
       display: flex;
       justify-content: flex-end;
       gap: 10px;

       margin-top: 10px;
       padding-top: 20px;

       border-top: 1px solid #f3f4f6;
}

.cancel-button,
.save-button {
       padding: 9px 16px;

       border-radius: 8px;

       font-size: 13px;
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

/* RESPONSIVO */

@media (max-width: 800px) {

       .page-header {
              flex-direction: column;
       }

       .create-button {
              align-self: flex-start;
       }

       .actions {
              flex-wrap: wrap;
       }

       .categories-info {
              padding: 12px 16px;
       }

       .categories-table {
              overflow: visible;
       }

       .categories-table table,
       .categories-table thead,
       .categories-table tbody {
              display: block;
              width: 100%;
       }

       .categories-table thead {
              display: none;
       }

.categories-table tr {
       display: grid;
       grid-template-columns: 1fr;
       min-width: 0;
       width: 100%;
       gap: 12px;
       padding: 16px;
       border-top: 1px solid #e5e7eb;
}

.categories-table td {
       display: flex;
       align-items: center;
       justify-content: space-between;
       gap: 12px;
       padding: 0;
       border-top: none;
       text-align: right;
       min-width: 0;
}

.categories-table td[data-label]::before {
       content: attr(data-label);
       font-size: 12px;
       font-weight: 600;
       color: #6b7280;
       text-transform: uppercase;
       flex-shrink: 0;
}

.categories-table td > * {
       min-width: 0;
}

.categories-table .description {
       max-width: none;
       white-space: normal;
       text-align: right;
}

.categories-table .category-name {
       justify-content: flex-start;
       text-align: left;
}

.categories-table .actions {
       justify-content: flex-end;
       min-width: 0;
}

}

@media (max-width: 600px) {

       .page-header h1 {
              font-size: 24px;
       }

       .create-button {
              width: 100%;
       }

       .page-header .create-button {
              display: none;
       }

.fab {
       position: fixed;
       right: 20px;
       bottom: calc(84px + env(safe-area-inset-bottom, 0));
       z-index: 300;
       width: 56px;
       height: 56px;
       display: flex;
       align-items: center;
       justify-content: center;
       border: none;
       border-radius: 50%;
       background: #16a34a;
       color: #ffffff;
       font-size: 28px;
       font-weight: 600;
       line-height: 1;
       cursor: pointer;
       box-shadow: 0 6px 18px rgba(22, 163, 74, 0.35);
}

       .fab:hover {
              background: #15803d;
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

       .category-form {
              padding: 18px;
       }

       .modal-footer {
              flex-direction: column-reverse;
       }

       .cancel-button,
       .save-button {
              width: 100%;
       }

}
</style>