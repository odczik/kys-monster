function heuristic (pos0, pos1) {
    var d1 = Math.pow(Math.abs(pos1.x - pos0.x), 2);
    var d2 = Math.pow(Math.abs(pos1.y - pos0.y), 2);
    return Math.sqrt(d1 + d2);
}

function findPath(matrix, start, end, startingWeights, wall) {
    let openSet = []
    let closedSet = []
    let path = []

    if(startingWeights){
        start.g = 0
        start.f = heuristic(start, end)
    } else {
        start = {x: start.x, y: start.y}
    }
    
    let current = start

    openSet.push(start)
    let counter = 0;
    while (openSet.length > 0 && counter < matrix.length * matrix[0].length) {
        counter++;
        let winner = 0
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i
            }
        }

        current = openSet[winner]

        if (current.x === end.x && current.y === end.y) {
            let temp = current
            path.push(temp)
            while (temp.previous) {
                path.push(temp.previous)
                temp = temp.previous
            }
            return path
        }

        openSet = openSet.filter(node => node.x !== current.x || node.y !== current.y)
        closedSet.push(current)

        let neighbors = []
        if (current.x < matrix[0].length - 1) {
            neighbors.push({value: matrix[current.y][current.x + 1], x: current.x + 1, y: current.y})
        }
        if (current.x > 0) {
            neighbors.push({value: matrix[current.y][current.x - 1], x: current.x - 1, y: current.y})
        }
        if (current.y < matrix.length - 1) {
            neighbors.push({value: matrix[current.y + 1][current.x], x: current.x, y: current.y + 1})
        }
        if (current.y > 0) {
            neighbors.push({value: matrix[current.y - 1][current.x], x: current.x, y: current.y - 1})
        }

        neighbors = neighbors.filter(neighbor => neighbor.value !== wall && !closedSet.includes(neighbor))

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i]
            let tempG = current.g + 1
            

            if (openSet.includes(neighbor)) {
                if (tempG < neighbor.g) {
                    neighbor.g = tempG
                }
            } else {
                neighbor.g = tempG
                openSet.push(neighbor)
            }

            neighbor.h = heuristic(neighbor, end)
            neighbor.f = neighbor.g + neighbor.h
            neighbor.previous = current
        }
    }
    return path
}