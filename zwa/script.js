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