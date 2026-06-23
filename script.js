console.log('Tejas Codes :)')

document.addEventListener('DOMContentLoaded', () => {
    const symRadio = document.getElementById('symRadio');
    const asymRadio = document.getElementById('asymRadio');
    const keyInput = document.getElementById('key');
    const infoText = document.querySelector('.info');

    function updateUI() {
        if (asymRadio.checked) {
            keyInput.placeholder = "Key (3+ digits to encrypt, roots to decrypt)";
            infoText.innerText = "* Asymmetric mode requires a key (3+ digits to encrypt, or comma-separated roots to decrypt).";
        } else {
            keyInput.placeholder = "Key (optional)";
            infoText.innerText = "* Remember to use the same key for decryption if provided.";
        }
    }

    symRadio?.addEventListener('change', updateUI);
    asymRadio?.addEventListener('change', updateUI);
    updateUI(); // Initial call
});
function encryptText() {
    const isAsymmetric = document.getElementById("asymRadio")?.checked;
    if (isAsymmetric) {
        return encryptAsymmetric();
    }

    const isLegacy = document.getElementById("legacyMode")?.checked;
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

    let keyShift = 0;
    if (keyInput) {
        let hash = 0;
        for (let i = 0; i < keyInput.length; i++) {
            hash = (hash << 5) - hash + keyInput.charCodeAt(i);
            hash |= 0;
        }
        keyShift = Math.abs(hash) % 256;
    }

    showLoader('encryptBtn', 'Encrypting...', () => {
        let encrypted = text;
        
        if (isLegacy) {
            const timeKey = Date.now();
            const shift = timeKey % 256;
            for (let i = 0; i < cycles; i++) {
                encrypted = encryptSym(encrypted, shift);
            }
            encrypted = encrypted + "|" + timeKey.toString(36);
            document.getElementById("inputText").value = encrypted;
        } else {
            // Use current date and time instead of random number
            const timeShift = Date.now() % 256;
            const totalShift = (timeShift + keyShift) % 256;
            
            for (let i = 0; i < cycles; i++) {
                encrypted = encryptSym(encrypted, totalShift);
            }

            // Append ONLY the timeShift as a single byte to retrieve it during decryption
            encrypted = encrypted + String.fromCharCode(timeShift);
            // Convert to Base62 to ensure only alphanumeric characters while minimizing length
            document.getElementById("inputText").value = toBase62(encrypted);
        }
    });
}

function decryptText() {
    const isAsymmetric = document.getElementById("asymRadio")?.checked;
    if (isAsymmetric) {
        return decryptAsymmetric();
    }

    const isLegacy = document.getElementById("legacyMode")?.checked;
    let codedB62 = document.getElementById("inputText").value;
    if (!codedB62) {
        alert("Please enter some text to decrypt.");
        return;
    }

    let coded;
    if (isLegacy) {
        coded = codedB62;
    } else {
        if (!/^[0-9A-Za-z]+$/.test(codedB62)) {
            alert("Invalid encrypted text format. It should only contain english letters and numbers (Base62).");
            return;
        }
        coded = fromBase62(codedB62);
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

    let keyShift = 0;
    if (keyInput) {
        let hash = 0;
        for (let i = 0; i < keyInput.length; i++) {
            hash = (hash << 5) - hash + keyInput.charCodeAt(i);
            hash |= 0;
        }
        keyShift = Math.abs(hash) % 256;
    }

    showLoader('decryptBtn', 'Decrypting...', () => {
        if (isLegacy) {
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
            // Fallback for even older format without |
            for (let i = 0; i < cycles; i++) {
                coded = decryptSym(coded, keyShift);
            }
            document.getElementById("inputText").value = coded;
            return;
        }

        if (coded.length > 0) {
            // The last byte is the timeShift
            const timeShift = coded.charCodeAt(coded.length - 1);
            coded = coded.substring(0, coded.length - 1);
            
            const totalShift = (timeShift + keyShift) % 256;

            for (let i = 0; i < cycles; i++) {
                coded = decryptSym(coded, totalShift);
            }
            document.getElementById("inputText").value = coded;
            return;
        }

        alert("Invalid symmetric encrypted text format.");
    });
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
    const isLegacy = document.getElementById("legacyMode")?.checked;
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
    const a = parseInt(keyInput.substring(0, partLen)) || 1;
    const bStr = keyInput.substring(partLen, partLen * 2);
    const c = parseInt(keyInput.substring(partLen * 2)) || 1;
    
    const b_fraction = parseFloat("0." + (bStr || "0"));
    
    // Construct positive real roots directly from the key parts
    const r1 = parseFloat((a + b_fraction + 1).toFixed(4)).toString();
    const r2 = parseFloat((c + b_fraction + 2).toFixed(4)).toString();
    
    const r1Float = parseFloat(r1);
    const r2Float = parseFloat(r2);

    const b_over_a = -(r1Float + r2Float);
    const c_over_a = r1Float * r2Float;
    
    showLoader('encryptBtn', 'Encrypting...', () => {
        let encrypted = "";
        for (let i = 0; i < text.length; i++) {
            let shift;
            if (isLegacy) {
                shift = Math.round(i * i + b_over_a * i + c_over_a) % 256;
            } else {
                const rawShift = Math.round((i * i + b_over_a * i + c_over_a) * 1000000);
                shift = ((rawShift % 256) + 256) % 256;
            }
            encrypted += String.fromCharCode((text.charCodeAt(i) + shift) % 256);
        }
        
        if (isLegacy) {
            document.getElementById("inputText").value = encrypted;
        } else {
            // Convert to Base62 to ensure only alphanumeric characters while minimizing length
            document.getElementById("inputText").value = toBase62(encrypted);
        }
        
        // Output decryption keys to the key textarea so the user can easily copy them
        document.getElementById("key").value = `${r1}, ${r2}`;
        document.querySelector('.info').innerText = "Keys generated! Please copy and save them to decrypt this text later.";
    });
}

function decryptAsymmetric() {
    const isLegacy = document.getElementById("legacyMode")?.checked;
    const codedB62 = document.getElementById("inputText").value;
    if (!codedB62) {
        alert("Please enter some text to decrypt.");
        return;
    }
    
    let text;
    if (isLegacy) {
        text = codedB62;
    } else {
        if (!/^[0-9A-Za-z]+$/.test(codedB62)) {
            alert("Invalid encrypted text format. It should only contain english letters and numbers (Base62).");
            return;
        }
        text = fromBase62(codedB62);
    }

    const keyInput = document.getElementById("key").value.trim();
    if (!keyInput.includes(",")) {
        alert("Please enter the two roots separated by a comma. e.g. '-1.2345, 0.6789'");
        return;
    }
    
    const parts = keyInput.split(",");
    const r1Str = parts[0].trim();
    const r2Str = parts[1].trim();
    
    const r1 = parseFloat(r1Str);
    const r2 = parseFloat(r2Str);
    
    if (isNaN(r1) || isNaN(r2)) {
        alert("Invalid root format. Please enter two valid numbers separated by a comma.");
        return;
    }

    const b_over_a = -(r1 + r2);
    const c_over_a = r1 * r2;
    
    showLoader('decryptBtn', 'Decrypting...', () => {
        let decrypted = "";
        for (let i = 0; i < text.length; i++) {
            let shift;
            if (isLegacy) {
                shift = Math.round(i * i + b_over_a * i + c_over_a) % 256;
            } else {
                const rawShift = Math.round((i * i + b_over_a * i + c_over_a) * 1000000);
                shift = ((rawShift % 256) + 256) % 256;
            }
            decrypted += String.fromCharCode((text.charCodeAt(i) - shift + 256) % 256);
        }
        
        document.getElementById("inputText").value = decrypted;
    });
}

function copyText() {
    const text = document.getElementById("inputText");
    text.select();
    text.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(text.value);
    
    const btn = document.querySelector('button[onclick="copyText()"]');
    if (btn) {
        btn.innerText = "Copied!";
        setTimeout(() => {
            btn.innerText = "Copy";
        }, 2000);
    }
}

function clearText() {
    document.getElementById("inputText").value = "";
    document.getElementById("key").value = "";
    
    const isAsymmetric = document.getElementById("asymRadio")?.checked;
    const infoText = document.querySelector('.info');
    if (infoText) {
        if (isAsymmetric) {
            infoText.innerText = "* Asymmetric mode requires a key (3+ digits to encrypt, or comma-separated roots to decrypt).";
        } else {
            infoText.innerText = "* Remember to use the same key for decryption if provided.";
        }
    }
}

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Helpers for ensuring output uses only alphanumeric characters while remaining compact
function toBase62(str) {
    if (!str) return "";
    let hex = "";
    let leadingZeroes = 0;
    let countingZeroes = true;
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code === 0 && countingZeroes) {
            leadingZeroes++;
        } else {
            countingZeroes = false;
        }
        hex += code.toString(16).padStart(2, '0');
    }
    
    let res = "";
    if (hex.length > 0 && hex !== "00".repeat(str.length)) {
        let dec = BigInt("0x" + hex);
        while (dec > 0n) {
            res = BASE62[Number(dec % 62n)] + res;
            dec = dec / 62n;
        }
    }
    
    return BASE62[0].repeat(leadingZeroes) + res;
}

function fromBase62(b62) {
    if (!b62) return "";
    
    let leadingZeroes = 0;
    for (let i = 0; i < b62.length; i++) {
        if (b62[i] === BASE62[0]) leadingZeroes++;
        else break;
    }
    
    let dec = 0n;
    for (let i = leadingZeroes; i < b62.length; i++) {
        let val = BigInt(BASE62.indexOf(b62[i]));
        if (val === -1n) return null;
        dec = dec * 62n + val;
    }
    
    let hex = "";
    if (dec > 0n) {
        hex = dec.toString(16);
        if (hex.length % 2 !== 0) {
            hex = '0' + hex;
        }
    }
    
    hex = "00".repeat(leadingZeroes) + hex;
    
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

// UI Helpers
function openManual() {
    document.getElementById('manualOverlay').classList.add('open');
}

function closeManual() {
    document.getElementById('manualOverlay').classList.remove('open');
}

function showLoader(btnId, loadingText, callback) {
    const btn = document.getElementById(btnId);
    let originalText = "";
    if (btn) {
        originalText = btn.innerText;
        btn.innerText = loadingText;
    }
    // Yield thread to allow browser to render the text change
    setTimeout(() => {
        try {
            callback();
        } finally {
            if (btn) {
                btn.innerText = originalText;
            }
        }
    }, 20);
}