const burger = document.querySelector('.nav-burger');

burger.addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('active');
    burger.classList.toggle('active');
});