<script setup>
import { onMounted, ref } from 'vue'
import categoryService from '../services/category.service'

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
              error.value = 'Não foi possível carregar as categorias.'
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
              alert('Informe o nome da categoria.')
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
                     'Não foi possível salvar a categoria.',
              )
       } finally {
              saving.value = false
       }
}

const toggleStatus = async (category) => {
       const action = category.active
              ? 'desativar'
              : 'ativar'

       const confirmed = confirm(
              `Deseja realmente ${action} a categoria "${category.name}"?`,
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
                     'Não foi possível atualizar o status.',
              )
       }
}

const deleteCategory = async (category) => {
       const confirmed = confirm(
              `Deseja excluir a categoria "${category.name}"?`,
       )

       if (!confirmed) return

       try {
              await categoryService.remove(category.id)

              await loadCategories()
       } catch (err) {
              console.error(err)

              alert(
                     err.response?.data?.message ||
                     'Não foi possível excluir a categoria.',
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
                            <h1>Categorias</h1>

                            <p>
                                   Organize os produtos da CuraVida por categorias.
                            </p>
                     </div>

                     <button class="create-button" @click="openCreateModal">
                            + Nova categoria
                     </button>

              </div>

              <!-- LOADING -->

              <div v-if="loading" class="state">
                     <p>Carregando categorias...</p>
              </div>

              <!-- ERRO -->

              <div v-else-if="error" class="state error">
                     <p>{{ error }}</p>

                     <button @click="loadCategories">
                            Tentar novamente
                     </button>
              </div>

              <!-- CONTEÚDO -->

              <div v-else class="categories-container">

                     <div class="categories-info">
                            <span>
                                   {{ categories.length }} categoria(s)
                            </span>
                     </div>

                     <!-- TABELA -->

                     <div v-if="categories.length" class="categories-table">

                            <table>

                                   <thead>
                                          <tr>
                                                 <th>Categoria</th>
                                                 <th>Descrição</th>
                                                 <th>Produtos</th>
                                                 <th>Status</th>
                                                 <th>Ações</th>
                                          </tr>
                                   </thead>

                                   <tbody>

                                          <tr v-for="category in categories" :key="category.id">

                                                 <!-- CATEGORIA -->

                                                 <td>

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

                                                 <td>
                                                        <span class="description">
                                                               {{ category.description || '—' }}
                                                        </span>
                                                 </td>

                                                 <!-- PRODUTOS -->

                                                 <td>

                                                        <span class="product-count">
                                                               {{ category._count?.products || 0 }}
                                                        </span>

                                                 </td>

                                                 <!-- STATUS -->

                                                 <td>

                                                        <span class="status" :class="{
                                                               active: category.active,
                                                               inactive: !category.active,
                                                        }">
                                                               {{ category.active ? 'Ativa' : 'Inativa' }}
                                                        </span>

                                                 </td>

                                                 <!-- AÇÕES -->

                                                 <td>

                                                        <div class="actions">

                                                               <button class="edit-button"
                                                                      @click="openEditModal(category)">
                                                                      Editar
                                                               </button>

                                                               <button class="status-button"
                                                                      @click="toggleStatus(category)">
                                                                      {{ category.active ? 'Desativar' : 'Ativar' }}
                                                               </button>

                                                               <button v-if="!category._count?.products"
                                                                      class="delete-button"
                                                                      @click="deleteCategory(category)">
                                                                      Excluir
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
                                   Nenhuma categoria encontrada
                            </h3>

                            <p>
                                   Crie sua primeira categoria para organizar os produtos.
                            </p>

                            <button class="create-empty-button" @click="openCreateModal">
                                   Criar categoria
                            </button>

                     </div>

              </div>

              <!-- MODAL -->

              <div v-if="showModal" class="modal-overlay" @click.self="closeModal">

                     <div class="modal">

                            <!-- CABEÇALHO -->

                            <div class="modal-header">

                                   <div>
                                          <span class="modal-label">
                                                 {{ editingCategory ? 'EDITAR' : 'NOVA' }}
                                          </span>

                                          <h2>
                                                 {{ editingCategory
                                                        ? 'Editar categoria'
                                                 : 'Nova categoria'
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
                                                 Nome
                                          </label>

                                          <input v-model="form.name" type="text" placeholder="Ex: Curativos"
                                                 maxlength="100" required />

                                   </div>

                                   <div class="form-group">

                                          <label>
                                                 Descrição
                                          </label>

                                          <textarea v-model="form.description" placeholder="Descrição da categoria..."
                                                 rows="4"></textarea>

                                   </div>

                                   <div class="form-group">

                                          <label>
                                                 Ícone
                                          </label>

                                          <input v-model="form.icon" type="text" placeholder="Ex: 🩹" maxlength="50" />

                                          <span class="form-help">
                                                 Você pode usar um emoji ou outro identificador.
                                          </span>

                                   </div>

                                   <!-- BOTÕES -->

                                   <div class="modal-footer">

                                          <button type="button" class="cancel-button" :disabled="saving"
                                                 @click="closeModal">
                                                 Cancelar
                                          </button>

                                          <button type="submit" class="save-button" :disabled="saving">
                                                 {{ saving
                                                        ? 'Salvando...'
                                                        : editingCategory
                                                 ? 'Salvar alterações'
                                                 : 'Criar categoria'
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
       background: #155c5c;
       color: #ffffff;
       font-size: 14px;
       font-weight: 600;
       cursor: pointer;
}

.create-button:hover,
.create-empty-button:hover {
       background: #104949;
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
       color: #155c5c;
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
       border-color: #155c5c;
       color: #155c5c;
}

.status-button {
       border: 1px solid #d1d5db;
       background: #ffffff;
       color: #6b7280;
}

.status-button:hover {
       border-color: #155c5c;
       color: #155c5c;
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
       border-color: #155c5c;
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
       background: #155c5c;
       color: #ffffff;
}

.save-button:hover {
       background: #104949;
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

       .actions {
              flex-wrap: wrap;
       }

}

@media (max-width: 600px) {

       .page-header h1 {
              font-size: 24px;
       }

       .create-button {
              width: 100%;
       }

       .modal-overlay {
              padding: 10px;
       }

       .modal {
              max-height: 95vh;
       }

}
</style>