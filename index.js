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

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUUID);

    serialCharacteristic = await service.getCharacteristic(serialUUID);

    await serialCharacteristic.startNotifications();

    serialCharacteristic.addEventListener('characteristicvaluechanged', read);

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
    console.log("reading");
    let buffer = event.target.value.buffer;
    let view = new Uint8Array(buffer);
    let decodedMessage = String.fromCharCode.apply(null, view);

    let newNode = document.createElement('p');
    newNode.classList.add("received-message");
    newNode.textContent = decodedMessage;

    document.getElementById("terminal").appendChild(newNode);

    let placeholder = document.getElementsByClassName('placeholder');
    if(placeholder.length != 0) placeholder[0].remove();
    
    //alert(decodedMessage);
    let msg = "";
    if (entered(msg)) {
        msg = "legal";
    }
    else {
        msg = "illegal";
    }
    writeB(msg);
}



async function write(event){
    let message = document.getElementById("message-input").value;
    message += '\n';
    let buffer = new ArrayBuffer(message.length);
    let encodedMessage = new Uint8Array(buffer);
    
    for(let i=0; i<message.length; i++){
        encodedMessage[i] = message.charCodeAt(i);
    }

    await serialCharacteristic.writeValue(encodedMessage);
    document.getElementById("message-input").value = null;
}

async function writeB(msg){
    let message = msg;
    message += '\n';
    let buffer = new ArrayBuffer(message.length);
    let encodedMessage = new Uint8Array(buffer);
    
    for(let i=0; i<message.length; i++){
        encodedMessage[i] = message.charCodeAt(i);
    }

    await serialCharacteristic.writeValue(encodedMessage);
}

document.getElementById('connect').addEventListener("click", connect);
document.getElementById('send').addEventListener("click", write);

