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

        try {
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    message
                })
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Message sent successfully!';
                messageDiv.className = 'message success';
                contactForm.reset();
            } else {
                messageDiv.textContent = result.error || 'Failed to send message';
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
