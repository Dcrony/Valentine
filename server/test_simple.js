import express from 'express';
const app = express();
const PORT = 5000;

app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test Server running on port ${PORT}`);
});
