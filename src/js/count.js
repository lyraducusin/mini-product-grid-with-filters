// count.js – Responsible for updating product count summary

import { productCountDisplay } from './dom.js'

export function updateProductCount(start, end, total) {
  if (productCountDisplay) {
    productCountDisplay.textContent = `Showing ${start} – ${end} of ${total} products`
  }
}
