const express = require("express");
const session = require("express-session");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: "auto", httpOnly: true, sameSite: "lax" }
}));

const designs = [
  { name: "موقع شخصي", price: 20, icon: "👤" },
  { name: "موقع ألعاب", price: 40, icon: "🎮" },
  { name: "موقع مدرس", price: 50, icon: "📚" },
  { name: "موقع مطعم", price: 50, icon: "🍔" },
  { name: "موقع شركة", price: 75, icon: "🏢" },
  { name: "متجر إلكتروني", price: 100, icon: "🛒" }
];

const whatsapp = "201080637195";

app.get("/", (req, res) => {
  const cards = designs.map(d => `
    <article class="card">
      <div class="icon">${d.icon}</div>
      <h3>${d.name}</h3>
      <p>تصميم عصري يناسب احتياجاتك</p>
      <div class="price">${d.price} جنيه</div>
      <a class="button" href="https://wa.me/${whatsapp}?text=${encodeURIComponent(
        "السلام عليكم، عايز أطلب " + d.name + " بسعر " + d.price + " جنيه من صمّملي"
      )}">اطلب التصميم</a>
    </article>
  `).join("");

  res.send(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>صمّملي | SAMEMLY</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#080811;color:#fff;font-family:Arial,sans-serif}
header{padding:22px 7%;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #29213d}
.logo{font-size:27px;font-weight:bold;color:#c084fc}
nav a{color:#fff;text-decoration:none;margin:0 8px}
.hero{text-align:center;padding:75px 18px 55px;background:radial-gradient(ellipse at top,#32105c 0%,#080811 68%)}
.hero h1{font-size:clamp(34px,7vw,58px);margin:0 0 15px}
.hero h1 span{color:#c084fc}
.hero p{color:#c7c3d2;line-height:1.9}
.button{display:inline-block;background:#a855f7;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:bold;margin-top:12px}
section{padding:45px 7%}
.title{text-align:center;font-size:30px;margin-bottom:10px}
.subtitle{text-align:center;color:#b7b2c6;margin-bottom:30px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}
.card{background:#12111e;border:1px solid #302342;border-radius:17px;padding:24px;text-align:center}
.icon{font-size:43px}
.card h3{margin-bottom:8px}
.card p{color:#b7b2c6;line-height:1.7}
.price{color:#d8b4fe;font-size:24px;font-weight:bold;margin-top:15px}
.custom{background:#171020;border:1px solid #7138a8;border-radius:18px;padding:30px;max-width:650px;margin:auto}
input,textarea{width:100%;padding:14px;margin:8px 0;background:#0b0a12;color:white;border:1px solid #40334e;border-radius:9px;font-size:16px}
button{border:0;cursor:pointer}
footer{text-align:center;padding:25px;color:#aaa;border-top:1px solid #29213d}
</style>
</head>
<body>
<header>
<div class="logo">✦ صمّملي</div>
<nav><a href="#designs">التصميمات</a><a href="#custom">تصميم خاص</a></nav>
</header>
<div class="hero">
<h1>فكرتك تستاهل <span>موقع مميز</span></h1>
<p>صمّم موقعك بالشكل اللي تحبه وبالسعر المناسب ليك.<br>اختار تصميم جاهز أو اطلب تصميم مخصوص ليك.</p>
<a class="button" href="#designs">شوف التصميمات ↓</a>
</div>
<section id="designs">
<h2 class="title">التصميمات الجاهزة</h2>
<p class="subtitle">اختار التصميم المناسب واطلبه على واتساب</p>
<div class="grid">${cards}</div>
</section>
<section id="custom">
<h2 class="title">عايز تصميم مخصوص؟</h2>
<p class="subtitle">التصميمات الخاصة بتبدأ من 250 جنيه والسعر حسب طلبك</p>
<form class="custom" action="/order" method="POST">
<input name="name" placeholder="اسمك" required>
<input name="type" placeholder="نوع الموقع اللي محتاجه" required>
<textarea name="details" placeholder="احكي لنا فكرتك بالتفصيل" rows="4" required></textarea>
<button class="button" type="submit">اطلب تصميم خاص</button>
</form>
</section>
<footer>© صمّملي SAMEMLY — كل الحقوق محفوظة</footer>
</body>
</html>`);
});

app.post("/order", (req, res) => {
  const { name, type, details } = req.body;
  const message = `طلب تصميم خاص من صمّملي%0Aالاسم: ${encodeURIComponent(name || "")}%0Aنوع الموقع: ${encodeURIComponent(type || "")}%0Aالتفاصيل: ${encodeURIComponent(details || "")}%0Aالسعر يبدأ من 250 جنيه`;
  res.redirect(`https://wa.me/${whatsapp}?text=${message}`);
});

app.get("/owner-login", (req, res) => {
  res.send(`<html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="background:#080811;color:white;font-family:Arial;text-align:center;padding:35px"><h2>دخول صاحب الموقع</h2><form method="post" action="/owner-login"><input name="username" placeholder="اسم المستخدم" required style="padding:12px"><br><br><input type="password" name="password" placeholder="كلمة المرور" required style="padding:12px"><br><br><button style="padding:12px">دخول</button></form></body></html>`);
});

app.post("/owner-login", (req, res) => {
  if (req.body.username === process.env.ADMIN_USERNAME &&
      req.body.password === process.env.ADMIN_PASSWORD) {
    req.session.owner = true;
    return res.redirect("/admin");
  }
  res.status(401).send("بيانات الدخول غير صحيحة");
});

app.get("/admin", (req, res) => {
  if (!req.session.owner) return res.redirect("/owner-login");
  res.send(`<html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="background:#080811;color:white;font-family:Arial;padding:30px"><h1>لوحة تحكم صمّملي</h1><p>تم تسجيل دخولك بنجاح.</p><p>الموقع جاهز لاستقبال طلبات العملاء عبر واتساب.</p><a href="/logout" style="color:#c084fc">تسجيل الخروج</a></body></html>`);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/owner-login"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("SAMEMLY is running on port " + port));
