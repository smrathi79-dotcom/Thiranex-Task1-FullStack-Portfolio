
# Full-Stack Developer Portfolio – Muthu Rathi S

A modern, responsive, and dynamic **Full-Stack Web Developer Portfolio** built using the **MERN Stack** (**MongoDB, Express.js, React.js, Node.js**) as part of **Thiranex Internship – Task 1**.

---

## ✨ Key Features

- **Responsive Split Hero UI:** Clean layout featuring profile showcase, role highlights, and direct resume download.
- **Light & Dark Theme Toggle:** Instant theme switching with persistent preference saved in `localStorage`.
- **Dynamic Project Management (Admin CRUD):** PIN-protected Admin Mode to add, edit, and delete projects stored directly in MongoDB Atlas.
- **Internship & Education Timeline:** Structured overview of practical experience (CodeAlpha, IPCS Global) and academic background.
- **Certificates & Credentials Showcase:** Verified certifications from CodeAlpha, Incrix Techlutions, Anthropic, Microsoft Learn, Naan Mudhalvan (TNSDC & HCL), and NxtWave.
- **Interactive Contact System:** Direct email/phone quick actions alongside a MongoDB-integrated message form.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), CSS3 (Custom Variables & Responsive Grid/Flexbox), Axios
- **Backend:** Node.js, Express.js, RESTful APIs
- **Database:** MongoDB Atlas, Mongoose

---

## 📂 Project Structure

```text
Portfolio website/
├── client/                 # React (Vite) Frontend
│   ├── public/             # Static assets (profile.jpg, resume.pdf)
│   └── src/
│       ├── App.jsx         # Main application & sections
│       └── App.css         # Light/Dark theme styles
├── server/                 # Node.js & Express Backend
│   └── index.js            # API routes & MongoDB models
└── .gitignore