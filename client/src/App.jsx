import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';
const ADMIN_PIN = '1234';

// Default Featured Project
const DEFAULT_PROJECTS = [
  {
    _id: 'default-techmart',
    title: 'TechMart – E-Commerce Web Application',
    description:
      'Developed a responsive e-commerce platform designed for seamless online shopping as part of the CodeAlpha internship. Implemented core features including dynamic product listings, category filtering, interactive shopping cart management, and a streamlined checkout flow to enhance user experience.',
    techStack: 'HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB / LocalStorage',
    githubLink: 'https://github.com/smrathi79-dotcom/techmart-ecommerce-codealpha',
    liveLink: '',
    isDefault: true
  }
];

// Your 6 Verified Certificates & Credentials
const CERTIFICATES = [
  {
    title: 'Full Stack Development Virtual Internship',
    issuer: 'CodeAlpha (MSME & MCA Registered)',
    date: 'Nov 2026',
    credentialId: 'CA/DF1/311664',
    description: 'Successfully completed the Virtual Internship Program in Full Stack Development (1st Oct 2026 – 30th Oct 2026).',
    verifyLink: 'https://www.linkedin.com/in/muthurathi-shanmugavel/'
  },
  {
    title: 'Generative AI for Full Stack Development',
    issuer: 'Incrix Techlutions LLP',
    date: 'Oct 2026',
    credentialId: 'IE26CSETK027',
    description: 'Completed 6-day intensive internship (VCSE2602) on integrating Generative AI into full-stack web workflows.',
    verifyLink: 'https://www.incrix.com'
  },
  {
    title: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic (UCC & HEA)',
    date: '2026',
    credentialId: 'ANTHROPIC-AIF',
    description: 'Certificate of Completion recognizing foundational mastery in AI frameworks, responsible usage, and prompt engineering.',
    verifyLink: 'https://www.linkedin.com/in/muthurathi-shanmugavel/'
  },
  {
    title: 'Introduction to AI Concepts',
    issuer: 'Microsoft Learn',
    date: '2026',
    credentialId: 'MS-LEARN-AI',
    description: 'Completed official Microsoft Learn training module covering core Artificial Intelligence principles and architectures.',
    verifyLink: 'https://learn.microsoft.com'
  },
  {
    title: 'EBPL – Career Shaper™ Certification',
    issuer: 'Naan Mudhalvan (TNSDC & HCL)',
    date: 'Oct 2025',
    credentialId: 'NME2425EAU29316286291',
    description: 'Awarded Certificate of Achievement by Tamil Nadu Skill Development Corporation & HCL for successful completion of EBPL.',
    verifyLink: 'https://www.linkedin.com/in/muthurathi-shanmugavel/'
  },
  {
    title: 'AI for Students: Build Your Own Generative AI Model',
    issuer: 'NxtWave',
    date: 'Mar 2024',
    credentialId: 'NXTWAVE-GENAI',
    description: 'Participated in hands-on Generative AI workshop conducted by AI expert and IIT Delhi alumnus Mr. Trivikrama.',
    verifyLink: 'https://www.linkedin.com/in/muthurathi-shanmugavel/'
  }
];

function App() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [showMsgForm, setShowMsgForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [imgError, setImgError] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') === 'light';
  });

  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-theme');
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('portfolio-theme', 'dark');
    }
  }, [isLightTheme]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      const dbProjects = res.data.filter(
        (p) => p.title.toLowerCase() !== DEFAULT_PROJECTS[0].title.toLowerCase()
      );
      setProjects([...DEFAULT_PROJECTS, ...dbProjects]);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects(DEFAULT_PROJECTS);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAdmin(true);
      setShowPinInput(false);
      setPinInput('');
    } else {
      alert('Wrong PIN!');
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (editingId && editingId !== 'default-techmart') {
        await axios.put(`${API_URL}/projects/${editingId}`, newProject);
      } else if (editingId === 'default-techmart') {
        DEFAULT_PROJECTS[0] = { ...DEFAULT_PROJECTS[0], ...newProject };
        await axios.post(`${API_URL}/projects`, newProject);
      } else {
        await axios.post(`${API_URL}/projects`, newProject);
      }
      setEditingId(null);
      setNewProject({ title: '', description: '', techStack: '', githubLink: '', liveLink: '' });
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to update/save! Make sure backend server (node index.js) is running.');
    }
  };

  const handleEditClick = (proj) => {
    setEditingId(proj._id);
    setNewProject({
      title: proj.title,
      description: proj.description,
      techStack: proj.techStack,
      githubLink: proj.githubLink || '',
      liveLink: proj.liveLink || ''
    });
    document.getElementById('admin-project-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProject({ title: '', description: '', techStack: '', githubLink: '', liveLink: '' });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    if (id === 'default-techmart') {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      return;
    }
    try {
      await axios.delete(`${API_URL}/projects/${id}`);
      if (editingId === id) handleCancelEdit();
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete! Make sure backend server is running.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/contact`, contact);
      setContactStatus(res.data.message);
      setContact({ name: '', email: '', message: '' });
    } catch (err) {
      setContactStatus('Failed to send message. Check server connection.');
    }
  };

  return (
    <div>
      {/* Navbar with Light/Dark Theme Toggle Icon */}
      <nav className="navbar">
        <div className="logo">Muthu Rathi S</div>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#education">Education</a>
            <a href="#certificates">Certificates</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setIsLightTheme(!isLightTheme)}
            title={isLightTheme ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {isLightTheme ? (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Split Hero Section */}
      <section className="hero-container" id="home">
        <div className="hero-left">
          <div className="badge-role">👋 Available for Full-Stack Roles</div>
          <h1>Hi, I'm <span>Muthu Rathi S</span></h1>
          <h2>Full-Stack Developer</h2>
          <p>
            I design and develop modern, responsive, and scalable full-stack web applications
            using MongoDB, Express.js, React.js, and Node.js. Passionate about clean code,
            Generative AI integration, and solving real-world problems.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn">Explore Projects</a>
            <a href="/resume.pdf" download="Muthu_Rathi_Resume.pdf" className="btn btn-outline">
              Download Resume ↓
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="profile-ring">
            {!imgError ? (
              <img
                src="/profile.jpg"
                alt="Muthu Rathi S"
                className="profile-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="profile-fallback">MR</div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section" id="about">
        <div className="section-header">
          <h2 className="section-title">About <span>Me</span></h2>
          <p className="section-subtitle">Get to know my background and development journey</p>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I am <strong>Muthu Rathi S</strong>, an enthusiastic <strong>Full-Stack Developer</strong> specializing in the
              MERN Stack with hands-on internship experience in Full-Stack Web Development, Generative AI, and Data Analytics.
            </p>
            <p>
              From crafting interactive frontend interfaces in React to building secure RESTful APIs
              with Node.js, Express, and MongoDB Atlas, I focus on performance, clean architecture,
              and continuous learning.
            </p>
          </div>
          <div className="stats-boxes">
            <div className="stat-card">
              <h3>7.99</h3>
              <p>B.E CSE CGPA</p>
            </div>
            <div className="stat-card">
              <h3>2+</h3>
              <p>Internships Completed</p>
            </div>
            <div className="stat-card">
              <h3>{CERTIFICATES.length}</h3>
              <p>Credentials Earned</p>
            </div>
            <div className="stat-card">
              <h3>MERN</h3>
              <p>Full-Stack Core</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Skills Section */}
      <section className="section" id="skills">
        <div className="section-header">
          <h2 className="section-title">Technical <span>Skills</span></h2>
          <p className="section-subtitle">Technologies and tools I work with</p>
        </div>
        <div className="skills-categories">
          <div className="skill-cat-card">
            <h3>Frontend Development</h3>
            <div className="skill-pills">
              {['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Responsive UI', 'Axios'].map((s) => (
                <span className="skill-pill" key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div className="skill-cat-card">
            <h3>Backend & Database</h3>
            <div className="skill-pills">
              {['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'MongoDB Atlas'].map((s) => (
                <span className="skill-pill" key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div className="skill-cat-card">
            <h3>AI, Data & Developer Tools</h3>
            <div className="skill-pills">
              {['Generative AI', 'Data Dashboards', 'SQL / Queries', 'Git & GitHub', 'VS Code', 'Vite'].map((s) => (
                <span className="skill-pill" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section" id="experience">
        <div className="section-header">
          <h2 className="section-title">Internship <span>Experience</span></h2>
          <p className="section-subtitle">Practical industry exposure and real-world contributions</p>
        </div>
        <div className="timeline">
          <div className="timeline-card">
            <div className="timeline-top">
              <span className="timeline-year">Oct 2026</span>
              <span className="timeline-badge">Remote</span>
            </div>
            <h3>Fullstack Developer Intern</h3>
            <h4>Code Alpha</h4>
            <ul className="timeline-list">
              <li>Gained practical hands-on experience in fullstack web development using modern front-end and back-end tools.</li>
              <li>Designed dynamic, highly responsive user interfaces and engineered core application backend workflows.</li>
            </ul>
          </div>

          <div className="timeline-card">
            <div className="timeline-top">
              <span className="timeline-year">Dec 2025</span>
              <span className="timeline-badge">Remote</span>
            </div>
            <h3>Data Analytics Intern</h3>
            <h4>IPCS Global</h4>
            <ul className="timeline-list">
              <li>Built interactive data dashboards to visualize key performance metrics and complex business trends.</li>
              <li>Performed comprehensive data cleaning, transformation, and query optimization for structured datasets.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section" id="education">
        <div className="section-header">
          <h2 className="section-title">My <span>Education</span></h2>
          <p className="section-subtitle">Academic qualification and foundation</p>
        </div>
        <div className="timeline" style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div className="timeline-card">
            <div className="timeline-top">
              <span className="timeline-year">2023 – 2027</span>
              <span className="timeline-badge">CGPA: 7.99 / 10</span>
            </div>
            <h3>B.E - Computer Science and Engineering</h3>
            <h4>Unnamalai Institute of Technology, Kovilpatti</h4>
            <p>Focused on full-stack web development, database management systems, data structures, and software engineering principles.</p>
          </div>
        </div>
      </section>

      {/* Certificates & Credentials Section */}
      <section className="section" id="certificates">
        <div className="section-header">
          <h2 className="section-title">Certificates & <span>Credentials</span></h2>
          <p className="section-subtitle">Verified certifications and technical milestones</p>
        </div>
        <div className="certs-grid">
          {CERTIFICATES.map((cert, index) => (
            <div className="cert-card" key={index}>
              <div>
                <div className="cert-header">
                  <div className="cert-icon">🏅</div>
                  <span className="cert-date">{cert.date}</span>
                </div>
                <h3>{cert.title}</h3>
                <div className="cert-issuer">{cert.issuer}</div>
                <p className="cert-desc">{cert.description}</p>
              </div>
              <div className="cert-footer">
                <span className="cert-id">ID: {cert.credentialId}</span>
                {cert.verifyLink && (
                  <a href={cert.verifyLink} target="_blank" rel="noreferrer" className="cert-link">
                    Verify ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="section" id="projects">
        <div className="section-header">
          <h2 className="section-title">Featured <span>Projects</span></h2>
          <p className="section-subtitle">Dynamic projects stored and fetched directly from MongoDB</p>
        </div>

        <div className="projects-grid">
          {projects.map((proj) => (
            <div className="project-card" key={proj._id}>
              <div>
                <h3>{proj.title}</h3>
                <p>{proj.description}</p>
                <div className="tech-tag">{proj.techStack}</div>
              </div>
              <div className="project-links">
                <div>
                  {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer">GitHub ↗</a>}
                  {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer">Live Demo ↗</a>}
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => handleEditClick(proj)}
                      style={{ background: '#38bdf8', color: '#0b1120', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj._id)}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Admin Add / Edit Project Form */}
        {isAdmin && (
          <div id="admin-project-form" className="form-box" style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h3>{editingId ? '✎ Edit Project (Admin Mode)' : '+ Add New Project (Admin Mode)'}</h3>
            <form onSubmit={handleSaveProject}>
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                required
              />
              <textarea
                rows="3"
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                value={newProject.techStack}
                onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="GitHub Link (optional, e.g. https://github.com/...)"
                value={newProject.githubLink}
                onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
              />
              <input
                type="text"
                placeholder="Live Demo Link (optional, e.g. https://...)"
                value={newProject.liveLink}
                onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="submit" className="btn">
                  {editingId ? 'Update Project' : 'Save Project'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{ background: 'transparent', border: '1px solid #64748b', color: 'var(--text-secondary)', padding: '0.75rem 1.4rem', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </section>

      {/* Contact Banner Section */}
      <section className="contact-banner-section" id="contact">
        <div className="contact-pill-label">CONTACT</div>
        <h2 className="contact-banner-title">Let's build something that ships.</h2>
        <p className="contact-banner-sub">
          Open to full-stack development roles and internships — MERN,
          AI integration, or anything in between.
        </p>

        <div className="contact-pill-buttons">
          <a href="mailto:muthurathi2005@gmail.com" className="contact-pill-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            muthurathi2005@gmail.com
          </a>

          <a href="tel:+919361937957" className="contact-pill-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            +91 9361937957
          </a>
        </div>

        <div className="contact-circle-icons">
          <a
            href="https://github.com/smrathi79-dotcom"
            target="_blank"
            rel="noreferrer"
            className="circle-icon-btn"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/muthurathi-shanmugavel/"
            target="_blank"
            rel="noreferrer"
            className="circle-icon-btn"
            aria-label="LinkedIn"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>

          <a
            href="mailto:muthurathi2005@gmail.com"
            className="circle-icon-btn"
            aria-label="Email"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>

          <a
            href="tel:+919361937957"
            className="circle-icon-btn"
            aria-label="Phone"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </a>
        </div>

        <button
          type="button"
          className="toggle-msg-btn"
          onClick={() => setShowMsgForm(!showMsgForm)}
        >
          {showMsgForm ? 'Hide Message Form' : 'Send a Quick Message ✉'}
        </button>

        {showMsgForm && (
          <div className="form-box">
            <h3>Send a Message</h3>
            <form onSubmit={handleContactSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                required
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                value={contact.message}
                onChange={(e) => setContact({ ...contact, message: e.target.value })}
                required
              />
              <button type="submit" className="btn">Send Message</button>
            </form>
            {contactStatus && <p className="status-msg">{contactStatus}</p>}
          </div>
        )}
      </section>

      {/* Bottom Footer */}
      <footer className="bottom-footer">
        <div>© 2026 Muthu Rathi S. Built layer by layer.</div>

        <div className="footer-right">
          {isAdmin ? (
            <button
              onClick={() => { setIsAdmin(false); handleCancelEdit(); }}
              style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '0.35rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              Exit Admin
            </button>
          ) : showPinInput ? (
            <form onSubmit={handlePinSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="password"
                placeholder="PIN (1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #38bdf8', background: 'var(--bg-card)', color: 'var(--text-primary)', width: '110px', fontSize: '0.82rem' }}
                autoFocus
              />
              <button type="submit" style={{ background: '#38bdf8', color: '#0b1120', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.82rem' }}>
                Unlock
              </button>
              <button type="button" onClick={() => setShowPinInput(false)} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowPinInput(true)}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '0.35rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              Admin Login
            </button>
          )}

          <a href="/resume.pdf" download="Muthu_Rathi_Resume.pdf" className="footer-resume-link">
            📄 Resume.pdf
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;