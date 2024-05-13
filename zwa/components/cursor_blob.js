const blob = document.getElementById('blob');

const moveBlob = (e, interacting) => {
    const x = e.clientX - blob.offsetWidth / 2,
          y = e.clientY - blob.offsetHeight / 2;

    blob.animate({
        transform: `translate(${x}px, ${y}px) scale(${interacting ? 6 : 1})`
    }, {
        duration: 800,
        fill: 'forwards'
    });
}

document.addEventListener("pointermove", (e) => {
    let interacting = false;

    console.log(e.target.closest('.cursor'))
    if(e.target.closest('.cursor')) {
        interacting = true;
    } else {
        interacting = false;
    }

    
    moveBlob(e, interacting);
})