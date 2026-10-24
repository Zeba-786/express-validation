const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Display registration form
app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Registration</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <h1>Student Registration</h1>
            <p class="subtitle">Register using your details</p>

            <form action="/register" method="POST">
                <label>Full Name</label>
                <input type="text" name="name"
                       placeholder="Enter your full name" required>

                <label>Email Address</label>
                <input type="text" name="email"
                       placeholder="Enter your email" required>

                <label>Age</label>
                <input type="number" name="age"
                       placeholder="Enter your age" required>

                <label>Password</label>
                <input type="password" name="password"
                       placeholder="Minimum 8 characters" required>

                <button type="submit">Register Now</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Validate submitted data on the server
app.post("/register", (req, res) => {
    const { name, email, age, password } = req.body;
    const errors = [];

    if (!name || !/^[a-zA-Z ]{3,50}$/.test(name.trim())) {
        errors.push("Name must contain 3-50 letters and spaces.");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.push("Please enter a valid email address.");
    }

    const studentAge = Number(age);

    if (
        age === undefined ||
        String(age).trim() === "" ||
        !Number.isInteger(studentAge) ||
        studentAge < 16 ||
        studentAge > 100
    ) {
        errors.push("Age must be between 16 and 100.");
    }

    if (!password || password.length < 8) {
        errors.push("Password must contain at least 8 characters.");
    }

    if (errors.length > 0) {
        return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Validation Errors</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Registration Failed</h1>
                <div class="error">
                    <ul>
                        ${errors.map(error =>
                            `<li>${escapeHTML(error)}</li>`
                        ).join("")}
                    </ul>
                </div>
                <a href="/">Go Back to Registration</a>
            </div>
        </body>
        </html>
        `);
    }

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Registration Successful</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <h1>Registration Successful!</h1>
            <div class="success">
                <p>Welcome, ${escapeHTML(name.trim())}!</p>
                <p>Your information passed server-side validation.</p>
            </div>
            <a href="/">Register Another Student</a>
        </div>
    </body>
    </html>
    `);
});

// Escape user input before inserting it into HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});