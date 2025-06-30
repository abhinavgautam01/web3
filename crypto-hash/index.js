const crypto = require("crypto")

function findhashwithprefix(prefix){
    let input = 0;
    while(true){
        let inputstr = "Golu" + input.toString()
        hash = crypto.createHash("sha256").update(inputstr).digest("hex")
        if (hash.startsWith(prefix)){
            return { input: inputstr, hash: hash}
        }
        input++;
    }
}

const result = findhashwithprefix("0000")
console.log(`Input: ${result.input}`)
console.log(`Hash: ${result.hash}`)