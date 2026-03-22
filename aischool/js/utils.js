/**
 * Shared utility functions for AI 4U Academy
 */

/**
 * Validates a password based on strict security requirements.
 * @param {string} password - The password to validate.
 * @returns {string|null} - An error message if invalid, or null if valid.
 */
export function validatePassword(password) {
    if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (/\s/.test(password)) {
        return "La contraseña no puede contener espacios en blanco.";
    }
    if (!/[A-Z]/.test(password)) {
        return "La contraseña debe incluir al menos una letra mayúscula.";
    }
    if (!/[0-9]/.test(password)) {
        return "La contraseña debe incluir al menos un número.";
    }
    return null;
}
