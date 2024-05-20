let key = 4; //

function encryptText() {
    const text = document.getElementById("inputText").value;
    const cycles = parseInt(document.getElementById("cycles").value) || 4; // Use default value of 1 if cycles is not a valid number

    if (!text || isNaN(cycles) || cycles <= 0) {
        alert("Please enter some text and a valid number of cycles.");
        return;
    }

    let encrypted = text;
    for (let i = 0; i < cycles; i++) {
        encrypted = encrypt(encrypted);
    }

    document.getElementById("inputText").value = encrypted;
}

function decryptText() {
    const coded = document.getElementById("inputText").value;
    const cycles = parseInt(document.getElementById("cycles").value) || 4; // Use default value of 1 if cycles is not a valid number

    if (!coded || isNaN(cycles) || cycles <= 0) {
        alert("Please enter some text and a valid number of cycles.");
        return;
    }

    let decrypted = coded;
    for (let i = 0; i < cycles; i++) {
        decrypted = decrypt(decrypted);
    }

    document.getElementById("inputText").value = decrypted;
}

function encrypt(text) {
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