document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const contactForm = document.getElementById('contactForm');
    const messageDiv = document.getElementById('message');
    const emailBtn = document.querySelector('.btn-email');
    const socialIcons = document.querySelectorAll('.social-icon');

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        html.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', function() {
        html.classList.toggle('dark-mode');
        const theme = html.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const message = document.getElementById('messageInput').value;

        const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1444986137197285419/LRzYP3QKSrDM8csDbS6774A8IT2eYlfpOpX-wXL60TAiJk0t-ZEOh5lVvQ72hBvibtXy"; // <-- put your webhook here

        try {
            const response = await fetch(DISCORD_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: `New message from **${name}** (${email}):\n${message}`
                })
            });

            if (response.status === 204) {
                messageDiv.textContent = 'Message sent successfully!';
                messageDiv.className = 'message success';
                contactForm.reset();
            } else {
                messageDiv.textContent = 'Failed to send message';
                messageDiv.className = 'message error';
            }
        } catch (error) {
            messageDiv.textContent = 'Error sending message: ' + error.message;
            messageDiv.className = 'message error';
        }

        setTimeout(() => {
            messageDiv.className = 'message';
        }, 5000);
    });

    emailBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:contact@example.com';
    });

    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Social icon clicked:', this.title);
        });
    });
});
