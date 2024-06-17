var ALL = {
    next: 0,
    boxes: {},
    size: 0
}
var speed = 5

function trueBoxSize(){


    if(window.innerHeight > window.innerWidth){

        ALL.size = ((1 / 10)* window.innerWidth)/2
    }else{

        ALL.size = ((1 / 10)* window.innerHeight)/2
    }
}
function ChoseDirection(id){

    let box = document.getElementById(id)

    box.style.top = `${window.innerHeight/2}px`, box.style.left = `${window.innerWidth/2}px`
    box.style.transform = 'translate(-50%, -50%)'

    ALL.boxes[id] = {}
    ALL.boxes[id]['move'] = [Math.floor(Math.random()*2), Math.floor(Math.random()*2)]
    ALL.boxes[id]['loc']  = [parseInt(box.style.left), parseInt(box.style.top)]
    console.log(ALL)
}

function addSquare(){

    let box = document.createElement('div')

    box.style.backgroundColor = `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.25)`
    box.classList.add('square')
    box.id = `box${ALL.next}`

    document.getElementById('container').appendChild(box)
    ChoseDirection(`box${ALL.next}`)
    
    ALL.next++
}
document.getElementById('amount').addEventListener('input', (e) => {

    if(e.target.value < ALL.next){
        
        for(let i = ALL.next; i>=e.target.value; i--){

            let box = document.getElementById(`box${i}`)
            if(box){
                box.remove()
                ALL.boxes[`box${i}`] = null
            }
        }
        ALL.next = e.target.value

    }else if(e.target.value > ALL.next){

        addSquare()
    }

})
addSquare()
trueBoxSize()

setInterval(() => {

    for(let i = 0; i<ALL.next; i++){
        
        let id = `box${i}`
        let box = document.getElementById(id)
        
        let top = parseInt(box.style.top), left = parseInt(box.style.left)

        if(top <= 0 + ALL.size) ALL.boxes[id]['move'][1] = 1
        else if(top >= window.innerHeight - ALL.size) ALL.boxes[id]['move'][1] = 0

        if(left <= 0 + ALL.size) ALL.boxes[id]['move'][0] = 1
        else if(left >= window.innerWidth - ALL.size) ALL.boxes[id]['move'][0] = 0


        box.style.top = ALL.boxes[id]['move'][1] == 0 ? `${top - speed}px` : `${top + speed}px`
        box.style.left = ALL.boxes[id]['move'][0] == 0 ? `${left - speed}px` : `${left + speed}px`
    }
}, 15)