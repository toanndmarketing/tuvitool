/**
 * ============================================
 * AUTH.JS - Simple Session-based Auth
 * Bảo vệ tính năng AI phân tích chuyên sâu
 * ============================================
 */

const AUTH = (function () {
    'use strict';

    const SESSION_KEY = 'tuvi_auth_session';

    /**
     * Kiểm tra xem user đã login chưa
     */
    function isAuthenticated() {
        const session = sessionStorage.getItem(SESSION_KEY);
        if (!session) return false;

        try {
            const data = JSON.parse(session);
            // Check expiry (30 phút)
            if (data.expiry && Date.now() < data.expiry) {
                return true;
            }
        } catch (e) {
            console.error('Invalid session data');
        }

        // Clear invalid session
        sessionStorage.removeItem(SESSION_KEY);
        return false;
    }

    /**
     * Gọi API để verify credentials
     */
    async function login(username, password) {
        try {
            const resp = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.error || 'Login failed');
            }

            const data = await resp.json();

            // Lưu session (30 phút)
            const session = {
                authenticated: true,
                expiry: Date.now() + (30 * 60 * 1000),
                token: data.token
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

            return { success: true };
        } catch (err) {
            console.error('[Auth] Login error:', err.message);
            return { success: false, error: err.message };
        }
    }

    /**
     * Logout
     */
    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
    }

    /**
     * Lấy auth token để gửi kèm request
     */
    function getAuthToken() {
        const session = sessionStorage.getItem(SESSION_KEY);
        if (!session) return null;

        try {
            const data = JSON.parse(session);
            return data.token || null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Hiển thị modal login
     */
    function showLoginModal(onSuccess, onCancel) {
        // Tạo modal HTML
        const modalHtml = `
            <div class="auth-modal-overlay" id="authModalOverlay">
                <div class="auth-modal">
                    <div class="auth-modal-header">
                        <h3>🔐 Đăng Nhập</h3>
                        <p>Để xem phân tích AI chuyên sâu, vui lòng đăng nhập</p>
                    </div>
                    <form id="authLoginForm" class="auth-form">
                        <div class="auth-form-group">
                            <label for="authUsername">Tên đăng nhập</label>
                            <input type="text" id="authUsername" placeholder="Username" required autocomplete="username">
                        </div>
                        <div class="auth-form-group">
                            <label for="authPassword">Mật khẩu</label>
                            <input type="password" id="authPassword" placeholder="Password" required autocomplete="current-password">
                        </div>
                        <div id="authError" class="auth-error" style="display:none;"></div>
                        <div class="auth-actions">
                            <button type="button" class="auth-btn-cancel" id="authBtnCancel">Hủy</button>
                            <button type="submit" class="auth-btn-submit" id="authBtnSubmit">
                                <span>Đăng nhập</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append to body
        const container = document.createElement('div');
        container.innerHTML = modalHtml;
        document.body.appendChild(container.firstElementChild);

        // Event handlers
        const overlay = document.getElementById('authModalOverlay');
        const form = document.getElementById('authLoginForm');
        const btnCancel = document.getElementById('authBtnCancel');
        const btnSubmit = document.getElementById('authBtnSubmit');
        const errorDiv = document.getElementById('authError');

        function closeModal(cancelled = false) {
            overlay.remove();
            if (cancelled && onCancel) {
                onCancel();
            }
        }

        btnCancel.addEventListener('click', () => closeModal(true));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(true);
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('authUsername').value.trim();
            const password = document.getElementById('authPassword').value;

            if (!username || !password) {
                errorDiv.textContent = 'Vui lòng nhập đầy đủ thông tin';
                errorDiv.style.display = 'block';
                return;
            }

            // Disable button
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span>Đang xác thực...</span>';
            errorDiv.style.display = 'none';

            const result = await login(username, password);

            if (result.success) {
                closeModal(false);
                if (onSuccess) onSuccess();
            } else {
                errorDiv.textContent = result.error || 'Sai tên đăng nhập hoặc mật khẩu';
                errorDiv.style.display = 'block';
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<span>Đăng nhập</span>';
            }
        });

        // Focus username
        setTimeout(() => {
            document.getElementById('authUsername').focus();
        }, 100);
    }

    return {
        isAuthenticated,
        login,
        logout,
        getAuthToken,
        showLoginModal
    };
})();
