# 📚 AI Digital Library Management System
> **A Production-Grade Academic Platform & Interactive Software Engineering Lab**  
> Developed for **Software Engineering (25CS312)** — Internal Assessment 3 (IA3)  
> **Karunya Institute of Technology and Sciences (Deemed University)**

---

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ecf8e.svg)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-18%2F18%20Passed-brightgreen.svg)](https://vitest.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

## 👨‍🎓 Student & Academic Attribution

| Attribute | Details |
| :--- | :--- |
| **Student Name** | **BODDU SOLOMON** |
| **Register Number** | **URK25CS1191** |
| **Degree & Branch** | B.Tech Computer Science and Engineering |
| **Course Title** | Software Engineering |
| **Course Code** | **25CS312** |
| **Assessment** | Internal Assessment 3 (IA3) |
| **Institution** | Karunya Institute of Technology and Sciences, Coimbatore |

---

## 🎯 Executive Summary & Purpose

The **AI Digital Library Management System** is an engineering project that bridges **practical full-stack SaaS architecture** with **theoretical Software Engineering curriculum guidelines**. 

Beyond serving as a high-performance digital library with real academic textbooks, multi-language internationalization (English, Tamil, Hindi, Telugu), and fine-grained Role-Based Access Control (RBAC), the platform functions as an **interactive, self-contained Software Engineering laboratory**. It demonstrates practical implementations of all **5 Course Outcomes (CO1–CO5)** and **5 Learning Units (LU I–LU V)** defined in the official curriculum.

---

## 🌟 Key System Capabilities

### 1. 📖 Digital Library Repository
- **Instant Academic Resource Catalog**: Real university textbooks and papers (Software Engineering Principles, Clean Architecture, Database Internals, Python, AI) served directly with fast, local zero-broken-link downloads.
- **Multimodal Search & Taxonomy**: Instant debounced search, category filtering, file-type filtering (PDF / EPUB), and dynamic sorting.
- **Security & Authorization**: Document uploads and metadata curation guarded by PostgreSQL Row-Level Security (RLS) policies.

### 2. 🤖 Library Intelligence Assistant
- **Curriculum-Trained AI Guide**: Provides interactive explanations of Software Engineering theory, test design, and architecture decisions.
- **Zero-Key-Leak Architecture**: Frontend interacts with a secure server-side proxy powered by Deno Edge Functions with a multi-provider fallback hierarchy (`Gemini 1.5 Flash` → `OpenRouter (Llama 3)` → `NVIDIA NIM`).
- **Autonomous Offline Resilience**: Client-side fallback engine ensures 100% operational uptime for viva demonstration even when remote cloud workers are unreachable.

### 3. 🌐 Full Internationalization (i18n)
- Seamless real-time locale switching between **English (EN)**, **Tamil (ta)**, **Hindi (hi)**, and **Telugu (te)** across all platform landing pages, catalog headers, and navigation interfaces.

### 4. 🛡️ Role-Based Access Control (RBAC) & Governance
- **Student View**: Search, inspect metadata, download academic resources, interact with AI assistant, and experiment with SE Lab modules.
- **Administrator View**: Analytical dashboard with asset download metrics, category taxonomy management, user promotion/demotion governance, and document ingestion.
- **Live Demo Sandbox**: One-click toggle switch allows faculty and examiners to evaluate both roles without logging in and out.

---

## 🔬 Syllabus Traceability & Course Outcome Coverage

| Unit / Outcome | Theoretical Topic | Implemented Lab Module & Evidence |
| :--- | :--- | :--- |
| **CO1 / LU I** | **Software Process Models** | Interactive evaluation of Waterfall, Incremental, Evolutionary, and Agile Scrum. Live **Mermaid Gantt Sprint Timeline** covering Sprints 1–5. |
| **CO2 / LU II** | **Software Requirements & Design** | Complete **SRS Specification** (IEEE 830 compliant), architectural blueprints, Dependency Inversion (IoC), and a **10-Diagram Mermaid UML Suite** (Use Case, Class, Sequence, Activity, State, Component, Deployment, etc.). |
| **CO3 / LU III** | **Software Testing Strategies** | **Black-Box Testing** (Equivalence Partitioning, Boundary Value Analysis at 50 MB, Decision Tables) and **White-Box Testing** (Control Flow Graph CFG, Cyclomatic Complexity $V(G) = E - N + 2P$, Basis Paths). |
| **CO4 / LU IV** | **Software Quality Assurance** | McCall's Quality Factors, ISO 9126 compliance matrix, Defect Removal Efficiency (DRE), and **18/18 Automated Unit & Schema Tests** via Vitest. |
| **CO5 / LU V** | **SCM, Estimation & Improvement** | **COCOMO II Estimation Calculator**, Work Breakdown Structure (WBS), Function Point Analysis, and Gitflow Branching Strategy visualizer. |

---

## 🧪 Automated Testing Evidence (18 / 18 Passed)

All test cases are written in TypeScript using **Vitest** + **jsdom** with strict Zod schema validation:

```text
 ✓ src/test/unit/validators.test.ts > registrationSchema > TC-BB-01: accepts valid registration data
 ✓ src/test/unit/validators.test.ts > registrationSchema > TC-BB-02: rejects name shorter than 2 characters
 ✓ src/test/unit/validators.test.ts > registrationSchema > accepts name at exactly minimum length (2 chars)
 ✓ src/test/unit/validators.test.ts > registrationSchema > TC-BB-03: rejects invalid email format
 ✓ src/test/unit/validators.test.ts > registrationSchema > TC-BB-04: rejects password without uppercase
 ✓ src/test/unit/validators.test.ts > registrationSchema > rejects password shorter than 8 characters
 ✓ src/test/unit/validators.test.ts > registrationSchema > rejects mismatched passwords
 ✓ src/test/unit/validators.test.ts > validateFile > TC-BB-07: accepts PDF at exactly 50 MB
 ✓ src/test/unit/validators.test.ts > validateFile > TC-BB-08: rejects PDF slightly over 50 MB
 ✓ src/test/unit/validators.test.ts > validateFile > TC-BB-09: rejects DOCX file type
 ✓ src/test/unit/validators.test.ts > validateFile > accepts EPUB file type
 ✓ src/test/unit/validators.test.ts > validateFile > accepts small PDF file
 ✓ src/test/unit/validators.test.ts > passwordStrength > returns score 0 for empty string
 ✓ src/test/unit/validators.test.ts > passwordStrength > returns score 1 for short password with length >= 8
 ✓ src/test/unit/validators.test.ts > passwordStrength > returns score 4 for strong password
 ✓ src/test/unit/validators.test.ts > loginSchema > accepts valid email + password
 ✓ src/test/unit/validators.test.ts > loginSchema > rejects empty email
 ✓ src/test/unit/validators.test.ts > loginSchema > rejects empty password

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Duration  1.65s (100% Pass Rate)
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript 5, Vite 5 |
| **Styling & UI Components** | Tailwind CSS, Radix UI primitives, Lucide React Icons |
| **State Management** | Zustand (persistent stores for Auth, Theme, Language, Chat) |
| **Routing** | React Router DOM v6 (declarative protected & RBAC-guarded routes) |
| **Diagram Engine** | Mermaid.js v11 (dynamic rendering of Gantt, UML, and Architecture) |
| **Database & Auth** | Supabase (PostgreSQL 15, Row Level Security, Auth Services) |
| **Storage & Edge Workers** | Supabase S3-compatible Object Storage, Deno Edge Functions |
| **AI Integration** | Google Gemini 1.5 Flash, OpenRouter API, NVIDIA NIM API |
| **Testing & Quality** | Vitest, @testing-library/react, Zod Validation, ESLint |

---

## 🚀 Getting Started Locally

### 1. Clone Repository
```bash
git clone https://github.com/b-solomon/SE_IA3_AI_Library.git
cd SE_IA3_AI_Library
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://ectfmfydnlvguixhzbmy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyODM0NjIsImV4cCI6MjEwODg1OTQ2Mn0.WHzdJyi0ACEVLG93wKKbS8VoPee1vuCOkJZxcWPDfN8
```

### 4. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 5. Run Automated Tests
```bash
npm test
```

---

## 🔐 Demo Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@karunya.edu` | `Admin@1234` | Full CRUD, User Governance, Uploads, Analytics |
| **Student** | `student@karunya.edu` | `Student@1234` | Read-only Catalog, AI Chat, SE Lab Modules |
| **Sandbox (No Login)**| *Navigate to `/demo`* | *None* | Interactive role switcher toggle on top-right |

---

## 📄 License
This academic project is published under the **MIT License**. Created by **BODDU SOLOMON (URK25CS1191)** for academic assessment in **25CS312 Software Engineering** at **Karunya University**.
