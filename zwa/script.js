const backgroundTextElms = document.querySelectorAll('.background-text');

let finalText = [];
const wordsArray = backgroundTextElms[0].innerText.split(/(\W+)/).filter(Boolean);
wordsArray.forEach((word) => {
    finalText.push(`<span class="char">${word}</span>`);
});
finalText = finalText.join('');

backgroundTextElms.forEach((backgroundTextElm) => {
    //backgroundTextElm.style.transform = `translateX(-${Math.random() * (max - min) + min}%)`;
    backgroundTextElm.style.animationDelay = `-${Math.random() * (1300 - 1100) + 1100}s`;
    backgroundTextElm.style.animationDuration = `${Math.random() * (2400 - 900) + 900}s`;

    backgroundTextElm.innerHTML = finalText;

    //console.log(backgroundTextElm.innerText.split(/[=.(),{};+-]/));
});

document.addEventListener("pointermove", (e) => {
    const { clientX, clientY } = e;
    const blob = document.getElementById('blob');
    blob.animate([{ 
            left: `${clientX}px`,
            top: `${clientY}px`
        }
    ], {
        duration: 3000,
        fill: 'forwards'
    });
})

document.getElementById("section-arrow-down").addEventListener("click", () => {
    document.getElementById("section-1").scrollIntoView({ behavior: "smooth" });
});



function init(){
	new SmoothScroll(document,120,12)
}

function SmoothScroll(target, speed, smooth) {
	if (target === document)
		target = (document.scrollingElement 
              || document.documentElement 
              || document.body.parentNode 
              || document.body) // cross browser support for document scrolling
      
	var moving = false
	var pos = target.scrollTop
  var frame = target === document.body 
              && document.documentElement 
              ? document.documentElement 
              : target // safari is the new IE
  
	target.addEventListener('mousewheel', scrolled, { passive: false })
	target.addEventListener('DOMMouseScroll', scrolled, { passive: false })

	function scrolled(e) {
		e.preventDefault(); // disable default scrolling

		var delta = normalizeWheelDelta(e)

		pos += -delta * speed
		pos = Math.max(0, Math.min(pos, target.scrollHeight - frame.clientHeight)) // limit scrolling

		if (!moving) update()
	}

	function normalizeWheelDelta(e){
		if(e.detail){
			if(e.wheelDelta)
				return e.wheelDelta/e.detail/40 * (e.detail>0 ? 1 : -1) // Opera
			else
				return -e.detail/3 // Firefox
		}else
			return e.wheelDelta/120 // IE,Safari,Chrome
	}

	function update() {
		moving = true
    
		var delta = (pos - target.scrollTop) / smooth
    
		target.scrollTop += delta
    
		if (Math.abs(delta) > 0.5)
			requestFrame(update)
		else
			moving = false
	}

	var requestFrame = function() { // requestAnimationFrame cross browser
		return (
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(func) {
				window.setTimeout(func, 1000 / 50);
			}
		);
	}()
}