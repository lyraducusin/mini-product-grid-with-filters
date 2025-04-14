// app.js
import '../styles/main.scss'
import products from '../data/products.json'

import { initializeModeToggle } from './mode-toggle.js'
import { createPagination } from './pagination.js'
import { renderCartItems, clearCart } from './cart.js'
import { renderProducts, setUpdateCartCallback } from './products.js'
import { updateProductCount } from './count.js'
import {
  filterByCategory,
  filterByPrice,
  filterBySearch,
  populateCategoryFilters,
  clearFilters as resetFilters
} from './filters.js'
import {
  productSearchInput,
  categoryFilter,
  minPriceInput,
  maxPriceInput,
  clearFilterBtn,
  cartSidebar,
  cartToggleBtn,
  closeCartBtn,
  cartItemsList,
  cartTotal,
  cartCount,
  clearCartBtn
} from './dom.js'


const pagination = createPagination({
  perPage: 6,
  controls: {
    prevBtn: document.getElementById('prevPage'),
    nextBtn: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo')
  },
  onPageChange: () => applyAllFilters()
})

function applyAllFilters() {
  const categoryFiltered = filterByCategory(products)
  const priceFiltered = filterByPrice(categoryFiltered)
  const searched = filterBySearch(priceFiltered)

  const total = searched.length
  const visible = pagination.getPageData(searched)

  const start = total === 0 ? 0 : (pagination.currentPage - 1) * pagination.perPage + 1
  const end = Math.min(start + visible.length - 1, total)

  renderProducts(visible)
  pagination.updateUI(total)
  updateProductCount(start, end, total)
}

function updateCartUI() {
  renderCartItems(cartItemsList, cartTotal, cartCount, updateCartUI)
  applyAllFilters()
}
setUpdateCartCallback(updateCartUI)
// Event listeners
clearFilterBtn.addEventListener('click', () => {
  resetFilters()
  pagination.reset()
  applyAllFilters()
})

categoryFilter.addEventListener('change', () => {
  pagination.reset()
  applyAllFilters()
})
minPriceInput.addEventListener('input', () => {
  pagination.reset()
  applyAllFilters()
})
maxPriceInput.addEventListener('input', () => {
  pagination.reset()
  applyAllFilters()
})
productSearchInput.addEventListener('input', () => {
  pagination.reset()
  applyAllFilters()
})

//Sidebar Open
cartSidebar.inert = true
cartToggleBtn.addEventListener('click', () => {
  cartSidebar.classList.toggle('open')
  cartSidebar.inert = false
  renderCartItems(cartItemsList, cartTotal, cartCount, updateCartUI)
})

//close cart button
closeCartBtn.addEventListener('click', () => {
  cartToggleBtn.focus()
  cartSidebar.inert = true
  cartSidebar.classList.remove('open')
  cartSidebar.setAttribute('aria-hidden', 'true')
})

//Clear Cart Btn
clearCartBtn.addEventListener('click', () => {
  clearCart()
  renderCartItems(cartItemsList, cartTotal, cartCount, updateCartUI)
  pagination.reset()
  applyAllFilters()
})

// Initial run
initializeModeToggle() //mode toggle
updateCartUI() //Cart Sidebar
pagination.reset() //Reset pagination
applyAllFilters() //ALL filters
populateCategoryFilters(products) //Category