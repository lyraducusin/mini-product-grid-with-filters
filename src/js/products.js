// product.js
import {
  productTemplate,
  productGrid,
  cartItemsList,
  cartTotal,
  cartCount
} from './dom.js'

import {
  addToCart,
  isInCart,
  renderCartItems
} from './cart.js'

const getImageUrl = (filename) => new URL(`../images/${filename}`, import.meta.url).href

let updateCartUI = () => {}
export function setUpdateCartCallback(callback) {
  updateCartUI = callback
}

//Message Toast
function showMessageToast(message) {
  const messageToast = document.getElementById('messageToast')
  if (!messageToast ) return

  messageToast .textContent = message
  messageToast .hidden = false
  messageToast .classList.add('show')

  setTimeout(() => {
    messageToast .classList.remove('show')
    setTimeout(() => (messageToast .hidden = true), 300) // Wait for fade out
  }, 2000)
}

// Modal Elements
const modal = document.getElementById('productModal')
const modalClose = modal.querySelector('.modal-close')

// modal content element
const modalElements = {
  title: document.getElementById('modalTitle'),
  image: document.getElementById('modalImage'),
  price: document.getElementById('modalPrice'),
  description: document.getElementById('modalDescription')
}

// Initialize modal once
function initModal() {
  modalClose.addEventListener('click', closeModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })
}

// Show modal with product details
function openModal(product) {
  const { title, image, price, description } = modalElements

  title.textContent = product.name
  image.src = getImageUrl(product.image)
  image.alt = product.name
  price.textContent = `$${product.price.toFixed(2)}`
  price.classList.add('product--price')
  description.textContent = product.description || 'No description available.'

  modal.hidden = false
  modal.setAttribute('aria-hidden', 'false')
  modalClose.focus()
}

// Hide modal
function closeModal() {
  modal.hidden = true
  modal.setAttribute('aria-hidden', 'true')
}

// Call once during script init
initModal()


// Render visible products into the grid
export function renderProducts(productList) {
  productGrid.innerHTML = ''
  productList.forEach(product => {
    const card = createProductCard(product)
    productGrid.appendChild(card)
  })
}

function createButton(label, className, ariaLabel) {
  const btn = document.createElement('button')
  btn.textContent = label
  btn.classList.add(className)
  btn.setAttribute('aria-label', ariaLabel)
  return btn
}

// Create a single product card from template index.html
export function createProductCard(product) {
  const clone = productTemplate.content.cloneNode(true)

  const img = clone.querySelector('.product--img')
  img.src = getImageUrl(product.image)
  img.alt = product.name

  const title = clone.querySelector('.product--title')
  title.textContent = product.name
  title.style.cursor = 'pointer'
  img.style.cursor = 'pointer'
  title.addEventListener('click', () => openModal(product))
  img.addEventListener('click', () => openModal(product))

  clone.querySelector('.product--price').textContent = `$${product.price.toFixed(2)}`

  // Update quick view button inside the template
  const quickViewBtn = clone.querySelector('.quick-view-btn')
  if (quickViewBtn) {
    quickViewBtn.addEventListener('click', () => openModal(product))
    quickViewBtn.setAttribute('aria-label', `View details for ${product.name}`)
  }

  const button = clone.querySelector('.add-to-cart')

  const quantityWrapper = document.createElement('div')
  quantityWrapper.classList.add('product--quantity-wrapper')

  const minusBtn = createButton('−', 'quantity-minus', `Quantity Minus of ${product.name}`)
  const plusBtn = createButton('+', 'quantity-plus', `Quantity Plus of ${product.name}`)
  const qtyInput = document.createElement('input')
  qtyInput.type = 'number'
  qtyInput.min = 1
  qtyInput.value = 1
  qtyInput.classList.add('product--quantity')
  qtyInput.name = `quantity-${product.name}`
  qtyInput.id = `quantity-${product.name}`
  qtyInput.setAttribute('aria-label', `Quantity input for ${product.name}`)

  quantityWrapper.append(minusBtn, qtyInput, plusBtn)
  button.before(quantityWrapper)

  // Quantity stepper
  minusBtn.addEventListener('click', () => {
    if (parseInt(qtyInput.value) > 1) qtyInput.value--
  })
  plusBtn.addEventListener('click', () => {
    qtyInput.value++
  })

  // Button state
  if (isInCart(product.name)) {
    setAddedState(button, product.name)
  } else {
    setAddableState(button, qtyInput, product)
  }

  return clone
}

function setAddedState(button, productName) {
  button.textContent = 'Added'
  button.disabled = true
  button.classList.add('added')
  button.setAttribute('aria-label', `${productName} Added to cart`)
}

function setAddableState(button, qtyInput, product) {
  button.textContent = 'Add to Cart'
  button.disabled = false
  button.classList.remove('added')
  button.setAttribute('aria-label', `Add ${product.name} to cart`)

  button.addEventListener('click', () => {
    const quantity = parseInt(qtyInput.value) || 1
    addToCart(product, quantity)
    renderCartItems(cartItemsList, cartTotal, cartCount, updateCartUI)
    showMessageToast(`${product.name} added to cart`)
    setAddedState(button, product.name)
  })
}
