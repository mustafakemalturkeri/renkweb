// Countdown Timer functionality
class CountdownTimer {
    constructor() {
        this.timers = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startCountdowns());
        } else {
            this.startCountdowns();
        }
    }

    startCountdowns() {
        // Find all countdown timers
        const countdownElements = document.querySelectorAll('.countdown-timer[data-target]');
        
        countdownElements.forEach(element => {
            const targetDate = new Date(element.getAttribute('data-target')).getTime();
            if (!isNaN(targetDate)) {
                this.startTimer(element, targetDate);
            }
        });
    }

    startTimer(element, targetDate) {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                this.showExpiredMessage(element);
                return;
            }

            // Calculate time units
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update display
            this.updateDisplay(element, days, hours, minutes, seconds);
        }, 1000);

        this.timers.push(timer);
    }

    updateDisplay(element, days, hours, minutes, seconds) {
        const daysEl = element.querySelector('#days');
        const hoursEl = element.querySelector('#hours');
        const minutesEl = element.querySelector('#minutes');
        const secondsEl = element.querySelector('#seconds');

        if (daysEl) daysEl.textContent = this.padZero(days);
        if (hoursEl) hoursEl.textContent = this.padZero(hours);
        if (minutesEl) minutesEl.textContent = this.padZero(minutes);
        if (secondsEl) secondsEl.textContent = this.padZero(seconds);
    }

    padZero(num) {
        return num.toString().padStart(2, '0');
    }

    showExpiredMessage(element) {
        element.innerHTML = `
            <div class="countdown-expired">
            <h3>🎉 Yayında! 🎉</h3>
            <a href="https://open.spotify.com/track/0hzdQMak0D5UP1BIrTxEQa?si=f60a4c8185944d6e" target="_blank" rel="noopener" class="spotify-btn" style="display:inline-block;padding:8px 16px;background:#1DB954;color:#fff;border-radius:24px;text-decoration:none;font-weight:bold;margin-top:10px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 168" width="20" height="20" style="vertical-align:middle;margin-right:8px;"><circle cx="84" cy="84" r="84" fill="#1ED760"/><path d="M119.7 122.1c-1.6 2.7-5.1 3.6-7.8 2-21.4-13-48.4-15.9-80.2-8.7-3.1.7-6.2-1.2-6.9-4.3-.7-3.1 1.2-6.2 4.3-6.9 34.2-7.7 63.6-4.4 87.2 9.6 2.7 1.6 3.6 5.1 2 7.8zm10.8-23.2c-2 3.2-6.2 4.2-9.4 2.2-24.5-15.1-61.9-19.5-90.9-10.7-3.6 1.1-7.4-1-8.5-4.6-1.1-3.6 1-7.4 4.6-8.5 32.2-9.6 72.2-5 99.7 12.1 3.2 2 4.2 6.2 2.2 9.5zm11.2-25.1c-2.4 3.8-7.4 5-11.2 2.6-28-17.2-74.2-18.8-101.1-10.3-4.3 1.3-8.8-1.1-10.1-5.4-1.3-4.3 1.1-8.8 5.4-10.1 30.2-9.2 80.2-7.5 112.7 11.2 3.8 2.4 5 7.4 2.6 11.2z" fill="#fff"/></svg>
                Spotify'da Dinle
            </a>
            </div>
        `;
    }

    // Clean up timers
    destroy() {
        this.timers.forEach(timer => clearInterval(timer));
        this.timers = [];
    }
}

// Make CountdownTimer globally available
window.CountdownTimer = CountdownTimer;

// Initialize countdown when page loads
window.countdownTimer = new CountdownTimer();

// Reinitialize when content changes (for dynamic loading)
document.addEventListener('contentLoaded', (event) => {
    if (event.detail && event.detail.section === 'home') {
        setTimeout(() => {
            window.countdownTimer.startCountdowns();
        }, 100);
    }
});

// Manual restart function for countdown
window.restartCountdown = function() {
    console.log('🕐 Restarting countdown manually...');
    if (window.countdownTimer) {
        window.countdownTimer.startCountdowns();
    }
};
