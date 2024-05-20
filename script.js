function encryptText() {
    const text = document.getElementById("inputText").value;
    if (!text) {
        alert("Please enter some text to encrypt.");
        return;
    }

    let halfLength = Math.floor(text.length / 2);
    let parts = [];
    parts.push(text.substring(0, halfLength));
    parts.push(text.substring(halfLength).split("").reverse().join(""));

    let key = Math.floor(Math.random() * 9) + 1;  // Random number between 1 and 9
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
    document.getElementById("inputText").value = encrypted;
}

function decryptText() {
    const coded = document.getElementById("inputText").value;
    if (!coded) {
        alert("Please enter some text to decrypt.");
        return;
    }

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
    document.getElementById("inputText").value = decrypted;
}

function copyText(){
    const copied = document.getElementById("inputText").value;
    navigator.clipboard.writeText(copied);
}
