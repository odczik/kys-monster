const transitionHalfTime = 200;

const main = document.querySelector("main");

main.style.transition = `opacity ${transitionHalfTime}ms ease`;

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector("main").style.opacity = 1;
})

window.transitionToPage = (href) => {
    document.querySelector("main").style.opacity = 0;

    const burger = document.querySelector('.nav-burger', false);
    document.querySelector('nav').classList.toggle('active', false);

    setTimeout(() => {
        window.location.href = href;
    }, transitionHalfTime)
}