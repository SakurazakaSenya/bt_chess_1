import ChessBoard from './chessboard';
import Game from './game.js';
import './style.css';

let game = new Game();
game.initialize();


var board = ChessBoard('chessboard', {
    draggable: false
});
let pos = game.getFEN();
board.position(pos);

document.getElementById('input').onkeypress = function(e) {
    if (e.keyCode == 13) {
        entered(document.getElementById('input').value);
        document.getElementById('input').value = "";
        console.log(serialCharacteristic);
    }
};

function entered(input) {
    console.log(input)
    if (game.enter(input)) {
        board.position(game.getFEN());
        //console.log(game.getFEN());
        return true;
    }
    else {
        return false;
    }
    //game.printPos();
    
}
    

//Bluetooth
const serviceUUID = 0xFFE0;
const serialUUID = 0xFFE1;

let device;
let serialCharacteristic;

async function connect(){

    device = await navigator.bluetooth.requestDevice({
        filters: [{
            services: [serviceUUID]
        }],
    });
    console.log("before server");
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUUID);

    serialCharacteristic = await service.getCharacteristic(serialUUID);
    console.log(serialCharacteristic);
    await serialCharacteristic.startNotifications();
    console.log("connected");
    serialCharacteristic.addEventListener('characteristicvaluechanged', read);
    document.getElementById('send').addEventListener("click", writing);

    document.getElementById('connect').removeEventListener("click", connect);
    document.getElementById('connect').addEventListener("click", disconnect);
    document.getElementById('connect').textContent = "Disconnect";
}

function disconnect(){
    device.gatt.disconnect();

    document.getElementById('connect').removeEventListener("click", disconnect);
    document.getElementById('connect').addEventListener("click", connect);
    document.getElementById('connect').textContent = "Connect";
}

function read(event) {
    console.log("begun reading");
    let buffer = event.target.value.buffer;
    let view = new Uint8Array(buffer);
    let decodedMessage = String.fromCharCode.apply(null, view);
    let temp = true;
    console.log("Message received!");
    if (entered(decodedMessage)) {
        document.getElementById("message-input").value = "1";
    }
    else {
        document.getElementById("message-input").value = "-1";
    }
    console.log(document.getElementById("message-input").value);
    write();
}

async function write(event){
    let message = document.getElementById("message-input").value;
    message += '\n';
    let buffer = new ArrayBuffer(message.length);
    let encodedMessage = new Uint8Array(buffer);
    console.log("writing in processs");
    for(let i=0; i<message.length; i++){
        encodedMessage[i] = message.charCodeAt(i);
    }

    await serialCharacteristic.writeValue(encodedMessage);
    console.log("Writing complete!");
    document.getElementById("message-input").value = null;
}

document.getElementById('connect').addEventListener("click", connect);
document.getElementById('send').addEventListener("click", write);
 function writing(event) {
     alert("button is working");
 }

