const stickyElm = document.querySelector('nav')

const observer = new IntersectionObserver( 
  ([e]) => e.target.classList.toggle('is-sticky', e.intersectionRatio < 1),
  {threshold: [1]}
);

observer.observe(stickyElm)