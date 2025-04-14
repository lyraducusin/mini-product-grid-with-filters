//product.js
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
  
    clone.querySelector('.product--title').textContent = product.name
    clone.querySelector('.product--price').textContent = `$${product.price.toFixed(2)}`
  
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
      setAddedState(button, product.name)
    })
  }
  