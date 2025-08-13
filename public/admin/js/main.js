document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      // Thêm/xóa class vào thẻ <body> để điều khiển toàn cục
      if (window.innerWidth > 768) {
        document.body.classList.toggle('sidebar-collapsed');
      } else {
        document.body.classList.toggle('sidebar-open');
      }
    });
  }
});