console.log('Tejas Codes :)')

function encryptText() {
    const isAsymmetric = document.getElementById("asymRadio")?.checked;
    if (isAsymmetric) {
        return encryptAsymmetric();
    }

    const text = document.getElementById("inputText").value;
    if (!text) {
        alert("Please enter some text to encrypt.");
        return;
    }

    const keyInput = document.getElementById("key").value.trim();
    let cycles = 2;

    if (keyInput) {
        if (!isNaN(keyInput) && Number.isInteger(Number(keyInput))) {
            cycles = parseInt(keyInput);
        } else {
            const asciiSum = [...keyInput].reduce((sum, char) => sum + char.charCodeAt(0), 0);
            cycles = Math.floor(asciiSum / keyInput.length); 
        }
    }
    
    // Cap cycles between 1 and 3 for fast output
    cycles = Math.max(1, Math.min(cycles, 3)); 

    let encrypted = text;
    // Use current date and time instead of random number
    const timeKey = Date.now();
    const shift = timeKey % 256;
    
    for (let i = 0; i < cycles; i++) {
        encrypted = encryptSym(encrypted, shift);
    }

    // Append the time-based key at the end to retrieve it during decryption
    encrypted = encrypted + "|" + timeKey.toString(36);
    document.getElementById("inputText").value = encrypted;
}

function decryptText() {
    const isAsymmetric = document.getElementById("asymRadio")?.checked;
    if (isAsymmetric) {
        return decryptAsymmetric();
    }

    let coded = document.getElementById("inputText").value;
    if (!coded) {
        alert("Please enter some text to decrypt.");
        return;
    }

    const keyInput = document.getElementById("key").value.trim();
    let cycles = 2;

    if (keyInput) {
        if (!isNaN(keyInput) && Number.isInteger(Number(keyInput))) {
            cycles = parseInt(keyInput);
        } else {
            const asciiSum = [...keyInput].reduce((sum, char) => sum + char.charCodeAt(0), 0);
            cycles = Math.floor(asciiSum / keyInput.length); 
        }
    }
    
    // Cap cycles between 1 and 3 for fast output
    cycles = Math.max(1, Math.min(cycles, 3));

    const lastPipe = coded.lastIndexOf("|");
    if (lastPipe !== -1) {
        const timeKeyStr = coded.substring(lastPipe + 1);
        const timeKey = parseInt(timeKeyStr, 36);
        if (!isNaN(timeKey)) {
             const shift = timeKey % 256;
             coded = coded.substring(0, lastPipe);
             for (let i = 0; i < cycles; i++) {
                 coded = decryptSym(coded, shift);
             }
             document.getElementById("inputText").value = coded;
             return;
        }
    }

    alert("Invalid symmetric encrypted text format. Missing time key.");
}

function encryptSym(text, shift) {
    const halfLength = Math.floor(text.length / 2);
    const part1 = text.substring(0, halfLength).split("").reverse().join("");
    const part2 = text.substring(halfLength).split("").reverse().join("");
    const encode = str => [...str].map(ch => String.fromCharCode((ch.charCodeAt(0) + shift) % 256)).join("");
    return encode(part2) + encode(part1);
}

function decryptSym(coded, shift) {
    const part2Len = Math.ceil(coded.length / 2);
    const part2Enc = coded.substring(0, part2Len);
    const part1Enc = coded.substring(part2Len);
    const decode = str => [...str].map(ch => String.fromCharCode((ch.charCodeAt(0) - shift + 256) % 256)).join("");
    const part2 = decode(part2Enc).split("").reverse().join("");
    const part1 = decode(part1Enc).split("").reverse().join("");
    return part1 + part2;
}

function encryptAsymmetric() {
    const text = document.getElementById("inputText").value;
    if (!text) {
        alert("Please enter some text to encrypt.");
        return;
    }
    const keyInput = document.getElementById("key").value.trim();
    if (keyInput.length < 3 || isNaN(keyInput)) {
        alert("Please enter a 3 or more digit number as the key for asymmetric encryption.");
        return;
    }
    
    const len = keyInput.length;
    const partLen = Math.floor(len / 3);
    const a = parseInt(keyInput.substring(0, partLen));
    const b = parseInt(keyInput.substring(partLen, partLen * 2));
    const c = parseInt(keyInput.substring(partLen * 2));
    
    if (a === 0) {
        alert("The first part (a) cannot be zero for quadratic roots.");
        return;
    }

    const b_over_a = b / a;
    const c_over_a = c / a;
    
    const D = b_over_a * b_over_a - 4 * c_over_a;
    let r1, r2;
    if (D >= 0) {
        r1 = ((-b_over_a + Math.sqrt(D)) / 2).toFixed(4);
        r2 = ((-b_over_a - Math.sqrt(D)) / 2).toFixed(4);
    } else {
        const real = (-b_over_a / 2).toFixed(4);
        const imag = (Math.sqrt(-D) / 2).toFixed(4);
        r1 = `${real}+${imag}i`;
        r2 = `${real}-${imag}i`;
    }
    
    let encrypted = "";
    for (let i = 0; i < text.length; i++) {
        const shift = Math.round(i * i + b_over_a * i + c_over_a) % 256;
        encrypted += String.fromCharCode((text.charCodeAt(i) + shift) % 256);
    }
    
    document.getElementById("inputText").value = encrypted;
    alert(`Asymmetric Encryption Successful!\nYour decryption keys (roots) are:\nRoot 1: ${r1}\nRoot 2: ${r2}\n\nPlease save them! Format to enter during decryption: "r1, r2" (e.g. "-1.2345, 0.6789")`);
    document.getElementById("key").value = ""; // Clear key
}

function decryptAsymmetric() {
    const text = document.getElementById("inputText").value;
    if (!text) {
        alert("Please enter some text to decrypt.");
        return;
    }
    const keyInput = document.getElementById("key").value.trim();
    if (!keyInput.includes(",")) {
        alert("Please enter the two roots separated by a comma. e.g. '-1.2345, 0.6789'");
        return;
    }
    
    const parts = keyInput.split(",");
    const r1Str = parts[0].trim();
    const r2Str = parts[1].trim();
    
    let b_over_a, c_over_a;
    
    if (r1Str.includes("i")) {
        const matches = r1Str.match(/([+-]?\d+\.?\d*)([+-]\d+\.?\d*)i/);
        if (matches) {
            const real1 = parseFloat(matches[1]);
            const imag1 = parseFloat(matches[2]);
            b_over_a = -(2 * real1);
            c_over_a = real1 * real1 + imag1 * imag1;
        } else {
            alert("Invalid complex root format.");
            return;
        }
    } else {
        const r1 = parseFloat(r1Str);
        const r2 = parseFloat(r2Str);
        b_over_a = -(r1 + r2);
        c_over_a = r1 * r2;
    }
    
    let decrypted = "";
    for (let i = 0; i < text.length; i++) {
        const shift = Math.round(i * i + b_over_a * i + c_over_a) % 256;
        decrypted += String.fromCharCode((text.charCodeAt(i) - shift + 256) % 256);
    }
    
    document.getElementById("inputText").value = decrypted;
}

function copyText() {
    const copied = document.getElementById("inputText").value;
    navigator.clipboard.writeText(copied);
}

function clearText() {
    document.getElementById("inputText").value = "";
    document.getElementById("key").value = "";
}