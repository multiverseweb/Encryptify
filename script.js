console.log('Tejas codes :)');
let cycle = 9;

function encryptText() {
    const text = document.getElementById("inputText").value;
    const cycles = parseInt(document.getElementById("cycles").value) || 9;

    if (!text || isNaN(cycles) || cycles <= 0) {
        alert("Please enter some text to encrypt.");
        return;
    }

    let encrypted = text;
    var key = Math.floor(Math.random() * 9) + 1;
    for (let i = 0; i < cycles; i++) {
        encrypted = encrypt(encrypted,key);
    }

    document.getElementById("inputText").value = encrypted;
}

function decryptText() {
    const coded = document.getElementById("inputText").value;
    const cycles = parseInt(document.getElementById("cycles").value) || 9;

    if (!coded || isNaN(cycles) || cycles <= 0) {
        alert("Please enter some text to decrypt.");
        return;
    }

    let decrypted = coded;
    for (let i = 0; i < cycles; i++) {
        decrypted = decrypt(decrypted);
    }

    document.getElementById("inputText").value = decrypted;
}

function encrypt(text,key) {
    let halfLength = Math.floor(text.length / 2);
    let parts = [];
    parts.push(text.substring(0, halfLength));
    parts.push(text.substring(halfLength).split("").reverse().join(""));

    let temp1 = [];
    parts.forEach(i => {
        let temp2 = "";
        for (let j of i) {
            j = j.charCodeAt(0) + key;
            temp2 += String.fromCharCode(j);
        }
        temp1.push(temp2);
    });

    let encrypted = temp1[1] + String(key) + temp1[0];
    return encrypted;
}

function decrypt(coded) {
    const keyIndex = Math.floor(coded.length / 2);
    const key = parseInt(coded.charAt(keyIndex));

    let encryptedPart1 = coded.substring(0, keyIndex);
    let encryptedPart2 = coded.substring(keyIndex + 1);

    let parts = [encryptedPart1, encryptedPart2];
    let temp1 = [];

    parts.forEach(i => {
        let temp2 = "";
        for (let j of i) {
            let value = j.charCodeAt(0) - key;
            temp2 += String.fromCharCode(value);
        }
        temp1.push(temp2);
    });

    let decrypted = temp1[1] + temp1[0].split("").reverse().join("");
    return decrypted;
}

function copyText() {
    const copied = document.getElementById("inputText").value;
    navigator.clipboard.writeText(copied);
}
function clearText(){
    document.getElementById("inputText").value = "";
    document.getElementById("cycles").value = "";
}
