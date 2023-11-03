document.addEventListener('DOMContentLoaded', function () {
    const menu = document.querySelector('.menu');
    const menuButton = document.querySelector('.menu_button');
    const buttonIcon = document.querySelector('.menu_button span i');

    menuButton.addEventListener('click', function () {
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        buttonIcon.classList.toggle('ri-close-line');
        buttonIcon.classList.toggle('ri-menu-4-fill');
    });
});