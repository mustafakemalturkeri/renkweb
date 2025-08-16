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
                <h3>🎉 Konser Zamanı! 🎉</h3>
                <p>Beklenen an geldi!</p>
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
