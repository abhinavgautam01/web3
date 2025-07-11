function asciiToBytes(asciiString){
    const arr = []
    for (let i = 0; i < asciiString.length; i++){
        arr.push(asciiString.charCodeAt(i))
    }
    return new Uint8Array(arr)
}

const ascii = "Golu"
const byteArray = asciiToBytes(ascii)
console.log(byteArray)

function hexToBytes(hexString) {
    if (hexString.length % 2 !== 0) {
        throw new Error("Invalid hex string");
    }

    const bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
}


function asciiToHex(asciiString) {
    let hex = "";
    for (let i = 0; i < asciiString.length; i++) {
        hex += asciiString.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
}
