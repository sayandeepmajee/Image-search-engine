const express = require("express");
const path = require("path");
const hbs = require("hbs");
const LogInCollection = require("./mongo");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer"); 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");
const partialPath = path.join(__dirname, "../partials");

app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);

app.use(express.static(publicPath));

let otpStore = {};
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "gmail_id",          
    pass: "app_password", 
  },
});

app.get("/", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/home", (req, res) => res.render("home"));
app.get("/sound", (req, res) => res.render("sound"));
app.get("/illustration", (req, res) => res.render("illustration"));
app.get("/video", (req, res) => res.render("video"));
app.get("/index", (req, res) => res.render("index"));
app.get("/otp", (req, res) => res.render("otp", { email: req.query.email }));
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await LogInCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).render("signup", { error: "Email already exists!" });
    }
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    otpStore[email] = { otp, name, password }; 
    const mailOptions = {
      from: `"ImageSearchEngine" <sayandeepmajee@gmail.com>`,
      to: email,
      subject: "Your OTP for SoundRealm Signup",
      text: `Hello ${name},\n\nYour OTP for signing up is: ${otp}\n\nDo not share this OTP with anyone.\n\nThanks!`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).render("signup", { error: "Error sending OTP. Try again." });
      } else {
        console.log("OTP sent:", info.response);
        res.redirect(`/otp?email=${email}`);
      }
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).render("signup", { error: "Error during signup. Try again." });
  }
});

app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
      return res.status(400).render("otp", { email, error: "No OTP found. Please try again." });
    }

    if (otpStore[email].otp === otp) {
      const { name, password } = otpStore[email];
      const user = new LogInCollection({ name, email, password });
      await user.save();

      delete otpStore[email]; 
      return res.status(201).render("home", { naming: name });
    } else {
      return res.status(400).render("otp", { email, error: "Invalid OTP. Try again." });
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).render("otp", { email: req.body.email, error: "Error verifying OTP. Try again." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await LogInCollection.findOne({ email });

    if (!user) {
      return res.status(404).render("login", { error: "Email not found. Please sign up first." });
    } else if (user.password === password) {
      res.status(200).render("home", { naming: user.name });
    } else {
      res.status(401).render("login", { error: "Incorrect password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).render("login", { error: "Error during login. Try again." });
  }
});

app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
