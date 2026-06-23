# Encryptify

A professional web application for encrypting and decrypting text securely.

![Encryptify Interface](https://github.com/multiverseweb/Encryptify/blob/main/resources/encryptify.png?raw=true)

## Overview

Encryptify is a modern Progressive Web App (PWA) featuring offline capabilities and a premium Neumorphic interface. It provides a simple, intuitive interface to secure text messages through two distinct encryption modes: a time-based Symmetric mode that guarantees unique ciphertexts, and a mathematically advanced Asymmetric mode based on quadratic roots.

**Output Format:** All encrypted outputs are finalized into an alphanumeric Base62 format. This guarantees that your ciphertext will always consist strictly of English letters and numbers without any special characters, ensuring maximum compactness while remaining robust and safe for transmission.

## Algorithm Versions

Encryptify algorithms may update over time. The application allows you to specify which version of the math you are using to ensure older texts can still be decrypted.

- **Current Version (v2) [June 9, 2026 and later]:** The default, modern algorithm that securely handles English text and accurately encodes time-shifts into compact Base62 strings.
- **Version 1 (v1) [Pre June 9, 2026]:** The original, legacy algorithm. To decrypt texts generated before June 9, 2026, check the "Use Version 1 Algorithm (v1)" box in the interface.

## Intelligent Link Sharing & URL Parameters

Encryptify can be entirely controlled via the URL, essentially functioning as a lightweight API.
When you click **Copy Link**, the system generates an intelligent URL. If you just encrypted a message, the copied URL automatically instructs the receiver's browser to *decrypt* it upon opening!

You can manually pass the following parameters:

| Parameter | Alias | Description | Values |
| :--- | :--- | :--- | :--- |
| `pl` | `payload` | The text to pre-fill in the main input box. | Any text string |
| `t` | `type` | The encryption mode to use. | `s` (symmetric) or `a` (asymmetric) |
| `k` | `key` | The encryption key or decryption roots to pre-fill. | Any string/number |
| `v` | *(none)* | The mathematical algorithm version to use. | `1` (Older), `2` (Current) |
| `a` | `action` | Auto-executes an action immediately on page load. | `e` (encrypt) or `d` (decrypt) |

Example URL: `?pl=Hello&t=s&k=123&v=2&a=e`

## Encryption Algorithms

### 1. Symmetric Encryption
The symmetric mechanism uses a time-based algorithm that processes the text through multiple cycles (capped at 3 for optimal speed).

- **Cycle Determination**: If an optional key is provided, it dictates the number of encryption cycles (between 1 and 3). 
- **Time-Based Uniqueness**: The encryption utilizes a dynamic shift key derived from the exact millisecond timestamp of when the encryption occurs. This shift guarantees a unique ciphertext while keeping the appended overhead extremely minimal (just 1 byte).
- **Decryption**: The single-byte shift key is seamlessly appended to the ciphertext. To decrypt, the system extracts this byte to mathematically reverse the shift. *Note: If you provided an optional key during encryption, you must provide that exact same key to dictate the correct cycle count during decryption.*

### 2. Asymmetric Encryption (Positive Roots)
The asymmetric mode leverages quadratic equations to securely shift characters.

- **Encryption (The Lock)**: You provide a 3-or-more digit number (e.g., `153`). The system mathematically splits this into parts (`a`, `b`, and `c`) to generate two unique positive numbers (your decryption roots) and shifts every character based on the corresponding polynomial curve.
- **Decryption Keys (The Keys)**: The system mathematically derives the specific positive roots associated with your key. These are always clean, positive numbers (no imaginary or complex digits). 
- **Decryption**: To decrypt the text, the original numeric key will no longer work. You must provide the two positive roots as your decryption key (e.g., `2.5000, 5.5000`). The system mathematically reconstructs the polynomial from these roots to perfectly reverse the encryption.

## Usage Instructions

1. Open the [Encryptify Web App](https://multiverseweb.github.io/Encryptify/).
2. Enter the text you wish to encrypt or decrypt into the main text area.
3. Select your desired encryption mode (**Symmetric** or **Asymmetric**).
4. Provide a Key:
   - For **Symmetric**: The key is optional and dictates the cycle complexity.
   - For **Asymmetric Encryption**: Enter a 3+ digit numeric key.
   - For **Asymmetric Decryption**: Enter the exact comma-separated roots you were given during encryption.
5. Click **Encrypt** to secure your text, or **Decrypt** to reveal the original message.
6. Use the **Copy** button to copy the result to your clipboard, or **Clear** to reset the fields.

## License

This project is licensed under the [MIT License](LICENSE).
