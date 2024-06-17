const mainMenu = document.getElementById('mainMenu')
const pisquarky = document.getElementById('pisquarkyTable')
const tableScale = document.getElementById('tableScale')

try{
    const sideMenu = document.getElementById('sideMenu')
}catch(error){}
let hoverOverSideMenu = false

function changeURL(url){
    window.location.assign(url)
}
function openMenu(){
    mainMenu.style.left = '0'
    try{sideMenu.style.left = '5.8vh'}catch(error){}
}
function closeMenu(){
    mainMenu.style.left = '-5vh'
    try{sideMenu.style.left = '0.8vh'}catch(error){}
}
function calculate(){
    document.getElementById('ans').textContent = 'Hello World'
}
function displayVictory(msg){
    document.getElementById('ans').innerText = msg
}
function victory(correct){
    
    for(let i = 0; i<3; i++){
        if(allCells[i][0] == correct && allCells[i][1] == correct && allCells[i][2] == correct){
            return true
        }
    }
    for(let j = 0; j<3; j++){
        if(allCells[0][j] == correct && allCells[1][j] == correct && allCells[2][j] == correct){
            return true
        }
    }

    if(allCells[0][0] == correct && allCells[1][1] == correct && allCells[2][2] == correct){
        
        return true
    }else if(allCells[2][0] == correct && allCells[1][1] == correct && allCells[0][2] == correct){
        
        return true
    }
    return false
}
function makeTable(X, Y){
    try{
        let restart = false

        for(let y = 0; y<Y; y++){
            let row = pisquarky.insertRow(y)
            for(let x = 0; x<X; x++){

                let cell = row.insertCell(x)

                cell.classList.add('pisquarkyCell')
                cell.id = `cell${x}-${y}`

                cell.addEventListener('mouseup', () => {
                    if(restart || filledCells == 9){
                    
                        changeURL('pisquarky.html')

                    }else if(cell.innerHTML == '' && filledCells < 9){

                        cell.innerHTML = '<img src="assets/cross.svg">'
                        allCells[y][x] = 1
                        filledCells++
                    
                        if(victory(1)){

                            displayVictory('vyhrali jste')
                            restart = true       

                        }else if(filledCells < 9){
                        
                            let rdmX = Math.floor(Math.random()*X), rdmY = Math.floor(Math.random()*Y)
                            while(true){
                                rdmX = Math.floor(Math.random()*X), rdmY = Math.floor(Math.random()*Y)

                                if(document.getElementById(`cell${rdmX}-${rdmY}`).innerHTML == '') break
                            }

                            document.getElementById(`cell${rdmX}-${rdmY}`).innerHTML = '<img src="assets/circle.svg">'
                            allCells[rdmY][rdmX] = 2
                            filledCells++
                        
                            if(victory(2)){

                                displayVictory('mel(a) by ses nad sebou zamyslet')
                                restart = true

                            }
                        }
                    }
                })
            }
        }
    }catch(error){}
}

var filledCells = 0
var allCells = [[0,0,0],[0,0,0],[0,0,0]]
var menuOpened = false

mainMenu.addEventListener('mouseleave', closeMenu)
mainMenu.addEventListener('mouseover', openMenu)
try{
    sideMenu.addEventListener('mouseleave', closeMenu)
    sideMenu.addEventListener('mouseover', openMenu)
}catch(error){}

document.getElementById('paticka').innerHTML = '<div>Lukáš Macura, Matias Končak</div><div>Macura Končak Corp. ©2024</div><div>736 891 109</div>'

makeTable(3,3)