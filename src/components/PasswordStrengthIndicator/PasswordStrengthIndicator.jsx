import React from 'react';
import './PasswordStrengthIndicator.css';

export default function PasswordStrengthIndicator({ password }) {
    // Check all password requirements
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Check if all requirements are met
    const allRequirementsMet = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

    // Hide indicator if password is empty or all requirements are met
    if (!password || password.length === 0 || allRequirementsMet) {
        return null;
    }

    return (
        <div className="password-strength">
            <p className="strength-label">Password Strength:</p>
            <div className="strength-checks">
                <div className={`strength-check ${hasMinLength ? 'valid' : 'invalid'}`}>
                    <span className="check-icon">{hasMinLength ? '✓' : '✗'}</span>
                    <span className="check-text">Use at least 8 characters</span>
                </div>
                <div className={`strength-check ${hasUppercase ? 'valid' : 'invalid'}`}>
                    <span className="check-icon">{hasUppercase ? '✓' : '✗'}</span>
                    <span className="check-text">Use at least 1 uppercase letter (A–Z)</span>
                </div>
                <div className={`strength-check ${hasLowercase ? 'valid' : 'invalid'}`}>
                    <span className="check-icon">{hasLowercase ? '✓' : '✗'}</span>
                    <span className="check-text">Use at least 1 lowercase letter (a–z)</span>
                </div>
                <div className={`strength-check ${hasNumber ? 'valid' : 'invalid'}`}>
                    <span className="check-icon">{hasNumber ? '✓' : '✗'}</span>
                    <span className="check-text">Use at least 1 number (0–9)</span>
                </div>
                <div className={`strength-check ${hasSpecialChar ? 'valid' : 'invalid'}`}>
                    <span className="check-icon">{hasSpecialChar ? '✓' : '✗'}</span>
                    <span className="check-text">Use at least 1 special character (@#$!%*?&)</span>
                </div>
            </div>
        </div>
    );
}
