const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [
    { role: 'system', content: 'Sen bir yazılım mühendisliği asistanısın. Teknik sorulara profesyonel ve açıklayıcı yanıtlar ver.' }
];

app.use(express.static('public'));
app.use(express.json());

app.post('/ask', async (req, res) => {
    const prompt = req.body.prompt;

    conversationHistory.push({ role: 'user', content: prompt });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: conversationHistory,
            max_tokens: 150,
            temperature: 0.7,
        });

        const botResponse = response.choices[0].message.content.trim();

        conversationHistory.push({ role: 'assistant', content: botResponse });

        res.json({ response: botResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
