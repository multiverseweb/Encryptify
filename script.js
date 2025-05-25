console.log('Tejas Codes :)')
let cycle = 9;

function encryptText() {
    const text = document.getElementById("inputText").value;
    if (!text) {
        alert("Please enter some text to encrypt.");
        return;
    }
    const keyInput = document.getElementById("key").value.trim();
    let cycles;

    if (!isNaN(keyInput) && Number.isInteger(Number(keyInput))) {
        // If it's an integer number
        cycles = parseInt(keyInput);
    } else {
        // If it's a float or string: compute ASCII sum divided by length
        const asciiSum = [...keyInput].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        cycles = Math.floor(asciiSum / keyInput.length); // Round down to integer
    }
     if( isNaN(cycles) || cycles <= 0){
        cycles = 2; // Default to 7 cycle if input is invalid
     }

    let encrypted = text;
    var key = Math.floor(Math.random() * 9) + 1;
    for (let i = 0; i < cycles; i++) {
        encrypted = encrypt(encrypted, key);
    }

    document.getElementById("inputText").value = encrypted;
}

function decryptText() {
    const coded = document.getElementById("inputText").value;
   const keyInput = document.getElementById("key").value.trim();
    let cycles;

    if (!isNaN(keyInput) && Number.isInteger(Number(keyInput))) {
        // If it's an integer number
        cycles = parseInt(keyInput);
    } else {
        // If it's a float or string: compute ASCII sum divided by length
        const asciiSum = [...keyInput].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        cycles = Math.floor(asciiSum / keyInput.length); // Round down to integer
    }
    if (!coded) {
        alert("Please enter some text to decrypt.");
        return;
    }
    if (isNaN(cycles) || cycles <= 0) {
        cycles = 2; // Default to 1 cycle if input is invalid
    }

    let decrypted = coded;
    for (let i = 0; i < cycles; i++) {
        decrypted = decrypt(decrypted);
    }

    document.getElementById("inputText").value = decrypted;
}
function encrypt(text, key) {
    const halfLength = Math.floor(text.length / 2);
    const part1 = text.substring(0, halfLength).split("").reverse().join("");
    const part2 = text.substring(halfLength-1).split("").reverse().join("");
    const encode = str =>
        [...str].map(ch => String.fromCharCode((ch.charCodeAt(0) + key) % 256)).join("");

    const encoded1 = encode(part1);
    const encoded2 = encode(part2);

    // Embed the key at the center (replace one char)
    const encrypted = (encoded2 + encoded1).split("");
    const embedIndex = Math.floor(encrypted.length / 2);
    if (encrypted.length < 2){
        return encrypted+String.fromCharCode(key + 65);
    }
    encrypted[embedIndex] = String.fromCharCode(key + 65); // Embed key
    return encrypted.join("");
}

function decrypt(encrypted) {
    const chars = encrypted.split("");
    const embedIndex = Math.floor(chars.length / 2);
    const key = chars[embedIndex].charCodeAt(0) - 65;

    // Restore the encrypted char (best effort — can replace with placeholder or assume it was overwritten)
    chars[embedIndex] = "*"; // Optional placeholder if needed

    const coded = chars.join("");
    const halfLength = Math.floor(coded.length / 2);

    const encPart2 = coded.substring(0, halfLength);
    const encPart1 = coded.substring(halfLength);

    const decode = str =>
        [...str].map(ch =>
            String.fromCharCode((ch.charCodeAt(0) - key + 256) % 256)
        ).join("");

    const part2 = decode(encPart2).split("").reverse().join("");
    const part1 = decode(encPart1).split("").reverse().join("");

    return part1.substring(0, part1.length - 1) + part2;
}

function copyText() {
    const copied = document.getElementById("inputText").value;
    navigator.clipboard.writeText(copied);
}
function clearText() {
    document.getElementById("inputText").value = "";
    document.getElementById("key").value = "";
}