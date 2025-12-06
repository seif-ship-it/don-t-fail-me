const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!DISCORD_WEBHOOK_URL) {
    console.error('Error: DISCORD_WEBHOOK_URL environment variable is not set');
    process.exit(1);
}

app.post('/api/send-message', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const discordMessage = {
            content: `New Contact Form Submission`,
            embeds: [{
                title: 'New Message from Portfolio',
                color: 3447003,
                fields: [
                    {
                        name: 'Name',
                        value: name,
                        inline: true
                    },
                    {
                        name: 'Email',
                        value: email,
                        inline: true
                    },
                    {
                        name: 'Message',
                        value: message,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordMessage)
        });

        if (!response.ok) {
            throw new Error(`Discord API error: ${response.statusText}`);
        }

        res.json({ success: true, message: 'Message sent to Discord' });
    } catch (error) {
        console.error('Error sending to Discord:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

