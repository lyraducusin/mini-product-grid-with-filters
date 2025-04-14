/**
 * Initializes sidebar cart
 */

let cart = JSON.parse(localStorage.getItem('cart')) || []

/**
 * Save current cart
 */
export function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart))
}

/**
 * Get all items in the cart
 */
export function getCart() {
  return cart
}

/**
 * Clear the cart entirely
 */
export function clearCart() {
  cart = []
  saveCart()
}

/**
 * Get total price of all items in the cart
 */
export function calculateTotal() {
  return cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2)
}

/**
 * Check if a product exists in the cart by name
 */
export function isInCart(productName) {
  return cart.some(item => item.name === productName)
}

/**
 * Add a product to the cart or update quantity if it exists
 */
export function addToCart(product, quantity = 1) {
  const existingItem = cart.find(item => item.name === product.name)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ ...product, quantity })
  }
  saveCart()
}

/**
 * Set a specific quantity for an item
 */
export function setQuantity(name, amount) {
  const item = cart.find(i => i.name === name)
  if (!item) return

  item.quantity = amount
  if (item.quantity <= 0) {
    removeFromCart(name)
  } else {
    saveCart()
  }
}

/**
 * Increase product quantity by 1
 */
export function increaseQuantity(name) {
  const item = cart.find(i => i.name === name)
  if (!item) return
  setQuantity(name, item.quantity + 1)
}

/**
 * Decrease product quantity by 1
 */
export function decreaseQuantity(name) {
  const item = cart.find(i => i.name === name)
  if (!item) return
  setQuantity(name, item.quantity - 1)
}

/**
 * Remove an item from the cart completely
 */
export function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name)
  saveCart()
}

/**
 * Render cart UI in sidebar
 */
export function renderCartItems(cartItemsList, cartTotal, cartCount, onUpdateCallback) {
  cartItemsList.innerHTML = ''

  cart.forEach(item => {
    const li = document.createElement('li')

    // Product title and total for this item
    const name = document.createElement('span')
    name.textContent = `${item.name} – $${(item.price * item.quantity).toFixed(2)}`

    // Quantity & control buttons
    const controls = document.createElement('div')
    controls.className = 'cart-controls'

    const minus = document.createElement('button')
    minus.textContent = '−'
    minus.setAttribute('aria-label', `Decrease quantity of ${item.name}`)
    minus.addEventListener('click', () => {
      decreaseQuantity(item.name)
      onUpdateCallback()
    })

    const qty = document.createElement('span')
    qty.textContent = item.quantity
    qty.className = 'quantity'

    const plus = document.createElement('button')
    plus.textContent = '+'
    plus.setAttribute('aria-label', `Increase quantity of ${item.name}`)
    plus.addEventListener('click', () => {
      increaseQuantity(item.name)
      onUpdateCallback()
    })

    const remove = document.createElement('button')
    remove.textContent = 'x'
    remove.className = 'remove-from-cart';
    remove.setAttribute('aria-label', `Remove ${item.name}`)
    remove.addEventListener('click', () => {
      removeFromCart(item.name)
      onUpdateCallback()
    })

    controls.append(minus, qty, plus, remove)
    li.append(name, controls)
    cartItemsList.appendChild(li)
  })

  // Update cart total and item count
  if (cartTotal) cartTotal.textContent = calculateTotal()
  if (cartCount) {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0)
    cartCount.textContent = count
  }
}
