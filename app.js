const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Enable CORS for Postman/testing

const app = express();

// Middleware
app.use(cors()); // Allow requests from Postman
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Email endpoint
app.post('/send-email', upload.single('attachment'), async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const attachment = req.file ? req.file.path : null;

        // Configure Nodemailer (Gmail example)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tafadzwamachingauta245@gmail.com', 
                pass: 'zjrs rcdu mbne gvoz'
            }
        });

        // Email options
        const mailOptions = {
            from: 'tafadzwamachingauta245@gmail.com',
            to,
            subject,
            text,
            attachments: attachment ? [{ path: attachment }] : []
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});