// Websocket connection
//const address = "ws://192.168.0.236:8080"
const address = "wss://rps-online-1ixo.onrender.com/"

const ws = new WebSocket(address)
let avgPing = [];

let playersReady = 0;

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

ws.onopen = () => {
    document.getElementById("connTxt").style.display = "none";
    document.getElementById("multiplayerCont").style.display = "block";

    console.log('WebSocket connection with server established.')
    ws.send(JSON.stringify({type: "ping", time: Date.now()}))

    console.log(code)
    if(code){
        document.getElementById("multiplayerCont").style.display = "none";
        joinRoom(code);
    }
}

document.getElementById("hostRoom").addEventListener("click", e => {
    document.getElementById("multiplayerCont").style.display = "none";
    document.getElementById("hostCont").style.display = "block";
})
const hostRoom = (public) => {
    ws.send(JSON.stringify({type: "create", public}))
    document.getElementById("hostCont").innerHTML = "<h1 style='color: white;'>Waiting for player...</h1>";
}

document.getElementById("joinRoom").addEventListener("click", e => {
    document.getElementById("multiplayerCont").style.display = "none";
    document.getElementById("joinCont").style.display = "block";
})
const joinRoom = (code) => {
    const roomId = code ? code : document.getElementById("roomCode").value;
    ws.send(JSON.stringify({type: "join", params: roomId}));
}
const joinRandomRoom = () => {
    ws.send(JSON.stringify({type: "join", params: "random"}));
}

const copyUrlCode = (code) => {
    navigator.clipboard.writeText(`${window.location.href}?code=${code}`)
    alert("Copied!")
}

ws.onmessage = (message) => {
    const msg = JSON.parse(message.data)
    //if(msg.type !== "pong") console.log("Received>", msg)
    switch(msg.type){
        case "room":
            document.getElementById("hostCont").innerHTML = `<h1 style='color: white;'>Waiting for player...</h1>
                                                                    <h2 style='color: white;'>Room code: ${msg.value}</h2>
                                                                    <h3 style='color: white;'>${window.location.href}?code=${msg.value}<button onclick="copyUrlCode('${msg.value}')">Copy</button></h3>`;
            break;
        case "start":
            document.getElementById("hostCont").style.display = "none";
            document.getElementById("joinCont").style.display = "none";

            document.getElementById("gameCont").style.display = "flex";
            break;
        case "stop":
            alert("Opponent disconnected.")
            window.location.reload();
            break;
        case "update":
            switch(msg.updateType){
                case "oppWaiting":
                    document.getElementById("gameStatus").innerText = "Opponent is waiting."
                    break;
                case "draw":
                    document.getElementById("gameStatus").innerText = `Draw! Both players chose ${msg.thing}`
                    document.getElementById("playAgainBtn").style.display = "block";
                    break;
                case "win":
                    document.getElementById("gameStatus").innerText = `You win! Opponent chose ${msg.thing}`
                    document.getElementById("playAgainBtn").style.display = "block";
                    break;
                case "lose":
                    document.getElementById("gameStatus").innerText = `You lose! Opponent chose ${msg.thing}`
                    document.getElementById("playAgainBtn").style.display = "block";
                    break;
                case "playAgain":
                    playersReady++;
                    document.getElementById("playAgainBtn").innerText = `Play again ${playersReady}/2`
                    break;
                case "start":
                    playersReady = 0;
                    document.getElementById("playAgainBtn").innerText = `Play again ${playersReady}/2`
                    document.getElementById("playAgainBtn").disabled = false

                    document.getElementById("gameStatus").innerText = "Choose your fighter!"
                    document.getElementById("playAgainBtn").style.display = "none";
                    document.querySelectorAll(".playBtns").forEach(btn => {
                        btn.classList.remove("active")
                        btn.disabled = false;
                    })
                    break;
            }
            break;
        case "error":
            alert(msg.value)
            if(code && msg.value === "Room not found.") window.location.search = "";
        case "pong":
            let ping = Date.now() - msg.time;
            document.getElementById("ping").innerText = `Ping: ${ping}ms`
            ws.send(JSON.stringify({type: "ping", time: Date.now()}))
            avgPing.push(ping);
            if(avgPing.length > 30) avgPing.shift();
            const pingSum = avgPing.reduce((a, b) => a + b, 0);
            document.getElementById("avgPing").innerText = `Avg Ping: ${(pingSum / avgPing.length).toFixed(0)}ms`
            break;
    }
}

ws.onclose = (message) => {
    console.error("Connection closed:", message.reason)
    window.location.reload();
}

const play = (thing) => {
    const playBtns = document.querySelectorAll(".playBtns")
    playBtns.forEach(btn => btn.disabled = "true")
    playBtns.forEach(btn => btn.id === thing ? btn.classList.add("active") : null)
    ws.send(JSON.stringify({type: "update", value: thing}))
    document.getElementById("gameStatus").innerText = "Waiting for opponent..."
}
const playAgain = () => {
    playersReady++;
    document.getElementById("playAgainBtn").innerText = `Play again ${playersReady}/2`
    document.getElementById("playAgainBtn").disabled = true
    ws.send(JSON.stringify({type: "update", updateType: "playAgain"}))
}