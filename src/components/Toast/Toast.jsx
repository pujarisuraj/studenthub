import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
    useEffect(() => {
        if (duration > 0 && message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose, message]);

    // Don't render if no message
    if (!message) return null;

    return (
        <div className={`toast-notification ${type}`}>
            <div className="toast-content">
                <div className="toast-icon">
                    {type === 'success' ? (
                        <CheckCircle size={24} strokeWidth={2.5} />
                    ) : (
                        <span style={{ fontSize: '20px' }}>⚠️</span>
                    )}
                </div>
                <p className="toast-message">{message}</p>
                <button className="toast-close" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
