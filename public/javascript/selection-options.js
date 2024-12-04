// Tüm custom-category-select öğelerini seç
const categorySelects = document.querySelectorAll('.custom-category-select');

// Her bir custom-category-select için bağımsız olarak işlem yap
categorySelects.forEach((categorySelect) => {
  const selectedCategory = categorySelect.querySelector('.selected-category');
  const options = categorySelect.querySelectorAll('.category-option');
  const categoryOptions = categorySelect.querySelector('.category-options');

  // Seçim yapıldığında
  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation(); // Diğer tıklama olaylarını durdur
      const text = option.querySelector('p').textContent;

      // Seçili kategori alanını güncelle
      selectedCategory.querySelector('span').textContent = text;

      // Menü kapat
      categorySelect.classList.remove('open');
    });
  });

  // Açılır listeyi aç/kapat
  selectedCategory.addEventListener('click', (e) => {
    e.stopPropagation(); // Diğer tıklama olaylarını durdur
    categorySelect.classList.toggle('open');
  });
});

// Tıklama dışındaki yerlere basıldığında menüleri kapat
document.addEventListener('click', () => {
  categorySelects.forEach((categorySelect) => {
    categorySelect.classList.remove('open');
  });
});