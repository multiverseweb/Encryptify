# Encryptify

A professional web application for encrypting and decrypting text securely.

![Encryptify Interface](https://github.com/multiverseweb/Encryptify/blob/main/resources/encryptify.png?raw=true)

## Overview

Encryptify provides a simple, intuitive interface to secure text messages. It features two distinct encryption modes: a time-based Symmetric mode that guarantees unique ciphertexts, and a mathematically advanced Asymmetric mode based on quadratic roots.

## Encryption Algorithms

### 1. Symmetric Encryption
The symmetric mechanism uses a time-based algorithm that processes the text through multiple cycles (capped at 3 for optimal speed).

- **Cycle Determination**: If an optional key is provided, it dictates the number of encryption cycles (between 1 and 3). 
- **Time-Based Uniqueness**: The encryption relies on the exact millisecond timestamp of when the encryption occurs. This guarantees that encrypting the exact same text twice will produce entirely different encrypted outputs.
- **Decryption**: The timestamp is seamlessly embedded into the ciphertext. To decrypt, the system extracts this timestamp to mathematically reverse the shift. *Note: If you provided an optional key during encryption, you must provide that exact same key to dictate the correct cycle count during decryption.*

### 2. Asymmetric Encryption (Quadratic Roots)
The asymmetric mode leverages quadratic equations to securely shift characters.

- **Encryption (The Lock)**: You provide a 3-or-more digit number (e.g., `153`). The system mathematically splits this into polynomial coefficients (`a`, `b`, and `c`) and shifts every character based on the polynomial curve `x^2 + (b/a)x + (c/a)`.
- **Decryption Keys (The Keys)**: The system calculates the exact quadratic roots of this polynomial (which may include complex imaginary numbers like `-1.0000+1.4142i`) and alerts you with the results. 
- **Decryption**: To decrypt the text, the original numeric key will no longer work. You must provide the two quadratic roots as your decryption key (e.g., `-0.6972, -4.3028`). The system mathematically reconstructs the polynomial from these roots to perfectly reverse the encryption.

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
