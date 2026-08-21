<p align="center">
  <img src="./frontend/src/assets/branding/obsidian_web_logo_with_text.png" alt="Obsidian Web" width="500">
</p>
<p align="center">
  A web interface for accessing and interacting with an Obsidian vault.
</p>

---

# Obsidian Web

Obsidian Web is a self-hosted web application that provides a browser-based interface for an [Obsidian](https://obsidian.md/) vault.

The project is designed to make an Obsidian knowledge base accessible through a web interface while keeping the actual vault under your control.

## ✨ Features

- 🌳 Browse the Obsidian vault through a file tree
- 📄 View Markdown notes in the browser
- 🔗 Resolve and navigate Obsidian WikiLinks
- 🏷️ Browse notes by tags
- 🔎 Search notes
- 📅 Daily dashboard
- ☑️ Task dashboard
- 📥 Create and edit notes in a dedicated Inbox
- 📝 Markdown rendering
- 📊 Dashboard widgets
- 🔄 Refresh vault contents
- 🌐 Self-hosted architecture

## 🖥️ Screenshots

<!-- Add screenshots here later -->

## 🏗️ Architecture

Obsidian Web consists of two main components:

```text
┌───────────────────────────────┐
│          Web Browser          │
│                               │
│       React + TypeScript      │
└───────────────┬───────────────┘
                │ HTTP API
                ▼
┌───────────────────────────────┐
│            Backend            │
│                               │
│       FastAPI + Python        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Obsidian Vault         │
│                               │
│          Markdown files       │
└───────────────────────────────┘
```
### Frontend
React
TypeScript
Vite
React Router

### Backend
Python
FastAPI
Uvicorn

### Data
The application works directly with the Markdown files of an Obsidian vault.

## 📁 Project Structure
```text
Obsidian-Web/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   └── ...
│   │
│   └── public/
│       └── logo/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   └── ...
│   └── tests/
│
├── README.md
└── ...
```
## 🚀 Development
### Prerequisites
Node.js
npm
Python 3.x
An existing Obsidian vault
Frontend

### Frontend
```Bash
cd frontend
npm install
npm run dev
```
The frontend will then be available through the Vite development server.

### Backend

Create and activate a Python virtual environment:

```Bash
.venv\Scripts\activate
```
On Windows:
```Bash
.venv\Scripts\activate
```
Install the dependencies:
```Bash
pip install -r requirements.txt
```
Start the FastAPI development server:
```Bash
uvicorn app.main:app --reload
```
## ⚙️ Configuration

The backend needs to know where the Obsidian vault is located.

Configuration will be documented here once the configuration system is finalized.

## 🔐 Security

Obsidian Web is intended to be self-hosted.

The application should not expose the entire Obsidian vault for unrestricted writing access.

The current design separates:

read access to the vault
controlled writing through the Inbox
server-side access to the actual vault

Additional authentication and authorization will be added before exposing the application to the public internet.

## 🐳 Docker

Docker deployment is planned.

Once the Docker setup is implemented, this section will contain:

Docker Compose configuration
Environment variables
Vault mounting
Backend configuration
Frontend deployment
Reverse proxy configuration
HTTPS setup
## 🛣️ Roadmap
- [x] Vault file tree
- [x] Markdown note viewer
- [x] WikiLink navigation
- [x] Tag navigation
- [x] Note search
- [x] Daily dashboard
- [x] Task dashboard
- [x] Inbox
- [x] Markdown rendering
- [ ] Authentication
- [ ] Improved permissions
- [ ] Docker setup
- [ ] Production deployment
- [ ] HTTPS / reverse proxy
- [ ] Raspberry Pi deployment

## 📜 License

License information will be added later.