const transitionHalfTime = 200;

const main = document.querySelector("main");

main.style.transition = `opacity ${transitionHalfTime}ms ease`;

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector("main").style.opacity = 1;
})

window.transitionToPage = (href) => {
    document.querySelector("main").style.opacity = 0;

    document.querySelector('.nav-burger', false).classList.toggle('active', false);
    document.querySelector('nav').classList.toggle('active', false);

    setTimeout(() => {
        window.location.href = href;
    }, transitionHalfTime)
}