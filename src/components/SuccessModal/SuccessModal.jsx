import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ message, onClose, type = 'success' }) => {
    const isSuccess = type === 'success';
    const isError = type === 'error';

    return (
        <div className="success-modal-overlay" onClick={onClose}>
            <div className={`success-modal ${isError ? 'error-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
                {/* Icon Circle with Checkmark */}
                <div className={`success-icon-wrapper ${isError ? 'error-icon-wrapper' : ''}`}>
                    <svg className="success-checkmark" viewBox="0 0 52 52">
                        <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>

                {/* Message */}
                <h2 className="success-title">{isSuccess ? 'Success! 🎉' : 'Oops! ⚠️'}</h2>
                <p className="success-message">{message || (isSuccess ? "Operation completed successfully!" : "Something went wrong!")}</p>

                {/* Action Button */}
                <button
                    className={`success-modal-button ${isError ? 'error-modal-button' : ''}`}
                    onClick={onClose}
                >
                    {isSuccess ? 'Continue' : 'Close'}
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
