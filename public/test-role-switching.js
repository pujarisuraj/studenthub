/**
 * Role Switching Test Utility
 * 
 * This script provides utility functions to test role switching in the browser console.
 * Open browser DevTools (F12) and paste these functions to use them.
 */

// Get current user data
function getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            console.log('Current User:', userData);
            return userData;
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    } else {
        console.log('No user logged in');
        return null;
    }
}

// Switch to STUDENT role
function switchToStudent() {
    const user = getCurrentUser();
    if (user) {
        user.role = 'STUDENT';
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ Role switched to STUDENT. Refreshing page...');
        setTimeout(() => location.reload(), 500);
    }
}

// Switch to ADMIN role
function switchToAdmin() {
    const user = getCurrentUser();
    if (user) {
        user.role = 'ADMIN';
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ Role switched to ADMIN. Refreshing page...');
        setTimeout(() => location.reload(), 500);
    }
}

// Switch to PROFESSOR role
function switchToProfessor() {
    const user = getCurrentUser();
    if (user) {
        user.role = 'PROFESSOR';
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ Role switched to PROFESSOR. Refreshing page...');
        setTimeout(() => location.reload(), 500);
    }
}

// Switch to custom role
function switchToRole(roleName) {
    const user = getCurrentUser();
    if (user) {
        user.role = roleName.toUpperCase();
        localStorage.setItem('user', JSON.stringify(user));
        console.log(`✅ Role switched to ${roleName.toUpperCase()}. Refreshing page...`);
        setTimeout(() => location.reload(), 500);
    }
}

// Clear all auth data (logout without API call)
function forceLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Logged out. Refreshing page...');
    setTimeout(() => location.reload(), 500);
}

// Display help
function help() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║           StudentHub Role Switching Test Utility               ║
╚════════════════════════════════════════════════════════════════╝

Available Commands:
──────────────────────────────────────────────────────────────────

📊 View Current User:
   getCurrentUser()           - Shows current user details

🔄 Switch Roles:
   switchToStudent()          - Switch to STUDENT role
   switchToAdmin()            - Switch to ADMIN role
   switchToProfessor()        - Switch to PROFESSOR role
   switchToRole('CUSTOM')     - Switch to custom role

🚪 Logout:
   forceLogout()              - Logout without API call (testing only)

❓ Help:
   help()                     - Show this help message

──────────────────────────────────────────────────────────────────
Example Usage:
   > getCurrentUser()         // Check current role
   > switchToAdmin()          // Switch to admin
   > switchToStudent()        // Switch back to student
   > forceLogout()           // Force logout
──────────────────────────────────────────────────────────────────

Note: These functions modify localStorage for testing purposes.
In production, roles should only be changed via database updates.
    `);
}

// Auto-display help on load
help();

// Export functions to window for console access
window.testUtils = {
    getCurrentUser,
    switchToStudent,
    switchToAdmin,
    switchToProfessor,
    switchToRole,
    forceLogout,
    help
};

console.log('%c✨ Role switching test utilities loaded!', 'color: #4f46e5; font-size: 14px; font-weight: bold;');
console.log('%cType help() to see available commands', 'color: #64748b; font-size: 12px;');
