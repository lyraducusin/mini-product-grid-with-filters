// filters.js – All filtering logic

import { categoryFilter, minPriceInput, maxPriceInput, productSearchInput } from './dom.js'

// Filter products by selected category
export function filterByCategory(products) {
  const selected = Array.from(categoryFilter.selectedOptions).map(opt => opt.value)
  if (selected.length === 0) return products
  return products.filter(p => selected.includes(p.category))
}

// Generate category filter options
export function populateCategoryFilters(products) {
    const categories = [...new Set(products.map(p => p.category))]
    categories.forEach(category => {
      const option = document.createElement('option')
      option.value = category
      option.textContent = category
      categoryFilter.appendChild(option)
    })
  }

//Filter price
export function filterByPrice(products) {
  const min = parseFloat(minPriceInput.value) || 0
  const max = parseFloat(maxPriceInput.value) || Infinity
  return products.filter(p => p.price >= min && p.price <= max)
}

//Search input Filter
export function filterBySearch(products) {
  const searchValue = productSearchInput.value.toLowerCase().trim()
  if (!searchValue) return products
  return products.filter(product =>
    product.name.toLowerCase().includes(searchValue)
  )
}

export function clearFilters() {
  Array.from(categoryFilter.options).forEach(option => option.selected = false)
  minPriceInput.value = ''
  maxPriceInput.value = ''
  productSearchInput.value = ''
}
