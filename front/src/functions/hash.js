
const stringToHash = (string) => {

    let hash = 0;

    if (string.length == 0) return hash;

    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}


function generatePassword(length = 8, options = {}) {
    const {
        includeLowercase = true,
        includeUppercase = true,
        includeNumbers = true,
        includeSymbols = false
    } = options;

    let characters = '';
    if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) characters += '0123456789';
    if (includeSymbols) characters += '!@#$%^&*()_+[]{}|;:,.<>?';

    if (characters.length === 0) {
        throw new Error("No character types selected for password generation.");
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

export { stringToHash, generatePassword }
