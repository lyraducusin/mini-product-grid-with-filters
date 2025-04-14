export function createPagination({
    perPage = 6,
    onPageChange = () => {},
    controls = {}
  }) {
    let currentPage = 1
    let totalItems = 0
  
    const { prevBtn, nextBtn, pageInfo } = controls
  
    function getPageData(data = []) {
      totalItems = data.length
      const start = (currentPage - 1) * perPage
      const end = start + perPage
      return data.slice(start, end)
    }
  
    function updateUI() {
      const totalPages = Math.ceil(totalItems / perPage)
  
      if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
      }
  
      if (prevBtn) {
        prevBtn.disabled = currentPage === 1
      }
  
      if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0
      }
    }
  
    function goToPage(page) {
      const totalPages = Math.ceil(totalItems / perPage)
      if (page >= 1 && page <= totalPages) {
        currentPage = page
        onPageChange()
      }
    }
  
    function next() {
      goToPage(currentPage + 1)
    }
  
    function prev() {
      goToPage(currentPage - 1)
    }
  
    function reset() {
      currentPage = 1
    }
  
    prevBtn?.addEventListener('click', prev)
    nextBtn?.addEventListener('click', next)
  
    return {
      getPageData,
      updateUI,
      reset,
      goToPage,
      get currentPage() {
        return currentPage;
      },
      get perPage() {
        return perPage;
      }
    }
  }
  