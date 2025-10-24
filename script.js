const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('sideMenu');
hamburger.addEventListener('mouseenter', () => {
  sideMenu.style.left = '0';
});
sideMenu.addEventListener('mouseleave', () => {
  sideMenu.style.left = '-250px';
});
hamburger.addEventListener('mouseleave', () => {
  setTimeout(() => {
    if (!sideMenu.matches(':hover')) {
      sideMenu.style.left = '-250px';
    }
  }, 100);
});
const modeBtn = document.getElementById('modeToggle');
modeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});
