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