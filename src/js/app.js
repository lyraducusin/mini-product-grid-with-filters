import '../styles/main.scss' // SCSS Styles
import products from '../data/products.json' // Static product data
import {
  addToCart,
  getCart,
  isInCart,
  clearCart,
  renderCartItems
} from './cart.js' // Cart functions
import { initializeModeToggle } from './mode-toggle.js' // Mode toggle
import { createPagination } from './pagination.js' // Pagination logic

initializeModeToggle()

// Utility to resolve image path from static folder
const getImageUrl = (filename) => new URL(`../images/${filename}`, import.meta.url).href

// DOM Elements
const productCountDisplay = document.getElementById('productCount'); // Product count display
const productTemplate = document.getElementById('productCardTemplate') //Product card template
const productGrid = document.getElementById('productGrid') //Product grid container
const productSearchInput = document.getElementById('productSearch') // search input filter
const categoryFilter = document.getElementById('categoryFilter') //Category multi-select filter
const clearFilterBtn = document.getElementById('clearFilters') //Clear filters
const minPriceInput = document.getElementById('minPrice') // Minimum price input
const maxPriceInput = document.getElementById('maxPrice') //Maximum price input
const closeCartBtn = document.getElementById('closeCart') // Close cart sidebar button
const cartToggleBtn = document.getElementById('cartToggle') //Open cart sidebar toggle button
const cartSidebar = document.getElementById('cartSidebar') //Cart sidebar panel
const cartItemsList = document.getElementById('cartItems') //Cart item list container
const cartTotal = document.getElementById('cartTotal') //Cart total display
const cartCount = document.getElementById('cartCount') // Cart item count display
const clearCartBtn = document.getElementById('clearCart') //Clear cart button

// Pagination setup
const pagination = createPagination({
  perPage: 6,
  controls: {
    prevBtn: document.getElementById('prevPage'),
    nextBtn: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo')
  },
  onPageChange: () => applyAllFilters()
})

// Product count display
function updateProductCount(start, end, total) {
  if (productCountDisplay) {
    productCountDisplay.textContent = `Showing ${start} – ${end} of ${total} products`;
  }
}

// Create a single product card from template
function createProductCard(product) {
  const clone = productTemplate.content.cloneNode(true)

  const img = clone.querySelector('.product--img')
  img.src = getImageUrl(product.image)
  img.alt = product.name

  clone.querySelector('.product--title').textContent = product.name
  clone.querySelector('.product--price').textContent = `$${product.price.toFixed(2)}`

  const button = clone.querySelector('.add-to-cart')
  const quantityWrapper = document.createElement('div')
  quantityWrapper.classList.add('product--quantity-wrapper')

  const minusBtn = document.createElement('button')
  minusBtn.textContent = '−'
  minusBtn.classList.add('quantity-minus')
  minusBtn.setAttribute('aria-label', `Quantity Minus of ${product.name}`)
  
  const plusBtn = document.createElement('button')
  plusBtn.textContent = '+'
  plusBtn.classList.add('quantity-plus')
  plusBtn.setAttribute('aria-label', `Quantity Plus of ${product.name}`)
  const qtyInput = document.createElement('input')
  qtyInput.type = 'number'
  qtyInput.min = 1
  qtyInput.value = 1
  qtyInput.classList.add('product--quantity')
  qtyInput.setAttribute('name', `quantity-${product.name}`)
  qtyInput.setAttribute('id', `quantity-${product.name}`);

  quantityWrapper.appendChild(minusBtn)
  quantityWrapper.appendChild(qtyInput)
  quantityWrapper.appendChild(plusBtn)
  button.before(quantityWrapper)

  // Quantity stepper logic
  minusBtn.addEventListener('click', () => {
    if (parseInt(qtyInput.value) > 1) qtyInput.value--
  })
  plusBtn.addEventListener('click', () => {
    qtyInput.value++
  })

  // Button state based on cart
  if (isInCart(product.name)) {
    button.textContent = 'Added'
    button.disabled = true
    button.classList.add('added')
    button.setAttribute('aria-label', `${product.name} Added to cart`)
  } else {
    button.textContent = 'Add to Cart'
    button.setAttribute('aria-label', `Add ${product.name} to cart`)
    button.disabled = false
    button.addEventListener('click', () => {
      const quantity = parseInt(qtyInput.value) || 1
      addToCart(product, quantity)
      renderCartItems(cartItemsList, cartTotal, cartCount, updateCartUI)
      button.textContent = 'Added'
      button.disabled = true
      button.classList.add('added')
    })
  }

  return clone
}

// Render visible products into the grid
function renderProducts(productList) {
  productGrid.innerHTML = ''
  productList.forEach((product) => {
    const card = createProductCard(product)
    productGrid.appendChild(card)
  })
}

// Generate category filter options
function populateCategoryFilters(products) {
  const categories = [...new Set(products.map(p => p.category))]
  categories.forEach(category => {
    const option = document.createElement('option')
    option.value = category
    option.textContent = category
    categoryFilter.appendChild(option)
  })
}

//Search inputFilter
function filterBySearch(products) {
  const searchValue = productSearchInput.value.toLowerCase().trim()
  if (!searchValue) return products
  return products.filter(product =>
    product.name.toLowerCase().includes(searchValue)
  )
}


// Filter products by selected category
function filterByCategory(products) {
  const selected = Array.from(categoryFilter.selectedOptions).map(opt => opt.value)
  if (selected.length === 0) return products
  return products.filter(p => selected.includes(p.category))
}

// Filter products within selected price range
function filterByPrice(products) {
  const min = parseFloat(minPriceInput.value) || 0
  const max = parseFloat(maxPriceInput.value) || Infinity
  return products.filter(product => product.price >= min && product.price <= max)
}

// Apply ALL Filters price,category, search, pagination
function applyAllFilters() {
  const categoryFiltered = filterByCategory(products) //Category filter
  const priceFiltered = filterByPrice(categoryFiltered) //Price Filter
  const searched = filterBySearch(priceFiltered) //Search filter

  const total = searched.length
  const visible = pagination.getPageData(searched)

  const start = total === 0 ? 0 : (pagination.currentPage - 1) * pagination.perPage + 1
  const end = Math.min(start + visible.length - 1, total)

  renderProducts(visible)
  pagination.updateUI(total)
  updateProductCount(start, end, total)
}

// Reset all filters and refresh product list
function clearFilters() {
  Array.from(categoryFilter.options).forEach(option => option.selected = false)
  minPriceInput.value = ''
  maxPriceInput.value = ''
  pagination.reset()
  applyAllFilters()
}

// Event Listeners
clearFilterBtn.addEventListener('click', clearFilters)
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


// Re-render cart and product UI after quantity change in sidebar
function updateCartUI() {
  renderCartItems(cartItemsList, cartTotal, cartCount, updateCartUI)
  applyAllFilters()
}

// Initial setup
updateCartUI()
populateCategoryFilters(products)
pagination.reset()
applyAllFilters()
