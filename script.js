const threshold = 20
const check = document.getElementById("switch")
const check1 = document.getElementById("switch1")
const check2 = document.getElementById("switch2")

let text = document.getElementById("txtInp").value

const createKys = (e) => {
    if(e.x < 160 && e.y < 140) return
    const kys = document.createElement("div")
    kys.innerText = text
    kys.style.position = "absolute"
    kys.style.left = e.x + "px"
    kys.style.top = e.y + "px"
    kys.style.fontSize = "300%"
    kys.style.animation = "rotate 1.5s infinite linear"
    kys.style.cursor = "none"
    kys.style.zIndex = "1"
    document.body.appendChild(kys)
    setTimeout(() => {
        kys.remove()
    }, 1500)
}
let lastPos = {
    x: 0,
    y: 0
}
const handleKys = (e) => {
    if(!text) return
    if(check.checked){
        // thanks to:
            //https://www.calculator.net/distance-calculator.html
            //https://www.calculatorsoup.com/calculators/geometry-plane/midpoint-calculator.php
        //for making these scaryass calculations kinda easy (still pain tho)
        if(Math.floor(Math.sqrt(Math.pow(lastPos.x - e.pageX, 2) + Math.pow(lastPos.y - e.pageY, 2))) > threshold){
            createKys({x: Math.abs((lastPos.x + e.pageX) / 2), y: Math.abs((lastPos.y + e.pageY) / 2)})
        }
    }
    if(check1.checked){
        if(Math.abs(e.pageX - lastPos.x) > threshold){
            createKys({x: Math.abs((lastPos.x + e.pageX) / 2), y: e.pageY})
        }
        if(Math.abs(e.y - lastPos.y) > threshold){
            createKys({x: e.pageX, y: Math.abs((lastPos.y + e.pageY) / 2)})
        }
    }
    if(check2.checked){
        if(Math.floor(Math.sqrt(Math.pow(lastPos.x - e.pageX, 2) + Math.pow(lastPos.y - e.pageY, 2))) > threshold){
            createKys({x: lastPos.x + Math.abs((lastPos.x - e.pageX) / 4),       y: lastPos.y + Math.abs((lastPos.y - e.pageY) / 4)})
            createKys({x: lastPos.x + Math.abs((lastPos.x - e.pageX) / 2),       y: lastPos.y + Math.abs((lastPos.y - e.pageY) / 2)})
            createKys({x: lastPos.x + Math.abs(((lastPos.x - e.pageX) / 4) * 3), y: lastPos.y + Math.abs(((lastPos.y - e.pageY) / 4) * 3)})
        }
        /*if(Math.abs(e.x - lastPos.x) > threshold){
            createKys({x: lastPos.x + Math.abs((lastPos.x - e.x) / 4), y: e.y})
            createKys({x: lastPos.x + Math.abs((lastPos.x - e.x) / 2), y: e.y})
            createKys({x: lastPos.x + Math.abs(((lastPos.x - e.x) / 4) * 3), y: e.y})
        }
        if(Math.abs(e.y - lastPos.y) > threshold){
            createKys({x: e.x, y: lastPos.y + Math.abs((lastPos.y - e.y) / 4)})
            createKys({x: e.x, y: lastPos.y + Math.abs((lastPos.y - e.y) / 2)})
            createKys({x: e.x, y: lastPos.y + Math.abs(((lastPos.y - e.y) / 4) * 3)})
        }*/
    }
    createKys({x: e.pageX, y: e.pageY})
    lastPos.x = e.pageX
    lastPos.y = e.pageY
}
document.addEventListener("mousemove", (e) => handleKys(e))
document.addEventListener("touchmove", (e) => handleKys(e.touches[0]))

document.getElementById("txtInp").addEventListener("change", (e) => {
    text = e.target.value
    document.getElementById("txt").innerText = e.target.value
})
