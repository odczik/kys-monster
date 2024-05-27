const transitionHalfTime = 200;

const transtisionElements = document.querySelectorAll('.transition');

transtisionElements.forEach(element => {
    element.style.transition = `opacity ${transitionHalfTime}ms cubic-bezier(0.25, 0, 0.25, 1)`;
});

window.addEventListener("DOMContentLoaded", () => {
    transtisionElements.forEach(element => {
        element.style.opacity = 1;
    });
})

window.transitionToPage = (href) => {
    transtisionElements.forEach(element => {
        element.style.opacity = 0;
    });

    document.querySelector('.nav-burger', false).classList.toggle('active', false);
    document.querySelector('nav').classList.toggle('active', false);

    setTimeout(() => {
        window.location.href = href;
    }, transitionHalfTime)
}