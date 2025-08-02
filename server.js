const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const rateLimit = require("express-rate-limit");
const sanitizeHtml = require("sanitize-html");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// الحماية من السبام
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// لقراءة JSON من الفورم
app.use(express.json());

// عرض ملفات HTML و CSS
app.use(express.static(__dirname));

// مسار خاص لملف articles.json
app.get("/articles.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, "ar/articles.json"));
});

// مسار خاص لملف articles.json في المجلد ar
app.get("/ar/articles.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, "ar/articles.json"));
});

// مسار خاص لملف articles.json باللغة الإنجليزية
app.get("/en/articles.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, "en/articles.json"));
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "ar", "index.html"));
});

// الصفحة الرئيسية باللغة الإنجليزية
app.get("/en", (req, res) => {
    res.sendFile(path.join(__dirname, "en/homepage_3.html"));
});


// إرسال الإيميل وإغلاق السيرفر بعد الإرسال
app.post("/send-email", (req, res) => {
    const { name, email, subject } = req.body;
    const message = sanitizeHtml(req.body.message);

    if (!name || !email || !subject || !message) {
        return res.status(400).send("Missing fields");
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New message from ${name}: ${subject}`,
        text: `From: ${email}\n\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("EMAIL ERROR:", error);
            return res.status(500).send("Failed to send: " + error.message);
        }
        console.log("Email sent:", info.response);
        res.status(200).send("Success");


    });
});