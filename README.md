# Mini Product Grid with Filters


This is a standalone frontend application that displays a list of products and allows filtering by
category and price.

> Part of the **Frontend Developer Coding Challenge** (Challenge 2).

---
## Getting Started - To Compile
- npm install
- npm run dev
- Serve at http://localhost:5173


## Features
- Displays a responsive grid of products from a static `products.json` file
- Shows:
  - Product name
  - Product image (from local `/images` folder)
  - Product price
  - “Add to Cart” button
- Filter products by:
  - Search Products
  - Category (multi-select)
  - Price range
- Cart functionality with:
  - Sidebar preview
  - Cart count in header
  - Clear cart button
- Fully mobile-responsive layout
- Semantic HTML and accessibility-friendly structure
- Dark/light mode toggle with sound
- Pagination (6 products per page)
---


## Project Structure
src/
├── images/                # Local product images
├── sounds/                # Toggle local sound
├── data/
│   └── products.json      # product data
├── js/
│   ├── app.js             # Main app logic
│   ├── cart.js            # Cart logic
│   ├── count.js           # Display product counts logic 
│   ├── dom.js             # Display ALL DOM elements
│   ├── filters.js         # All Filters logic
│   └── mode.js            # Dark/light mode toggle
│   ├── pagination.js      # Pagination logic
│   ├── products.js        # display grid/products
├── styles/
│   ├── main.scss          # Main Scss import all styles
│   └── variables.scss     # Variables styles
│   └── global.scss        # Global styles
│   └── products.scss      # All Product Styles
index.html
vite.config.js
README.md