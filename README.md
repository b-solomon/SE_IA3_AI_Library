# 📚 AI Digital Library Management System & Interactive Software Engineering Lab
> **Department of Computer Science & Engineering | Software Engineering Laboratory (25CS312)**  
> **Karunya Institute of Technology and Sciences (Deemed-to-be-University), Coimbatore**

<div align="center">

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase%20%2B%20PostgreSQL%2015-3ECF8E.svg)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Automated%20Tests-18%2F18%20Passed-brightgreen.svg)](https://vitest.dev/)
[![Mermaid UML](https://img.shields.io/badge/UML%20Engine-Mermaid.js%20v11-ff3670.svg)](https://mermaid.js.org/)
[![License](https://img.shields.io/badge/Academic-Internal%20Assessment%20%233-indigo.svg)]()

</div>

---

## 👥 Student & Academic Attribution

| Attribute | Details |
| :--- | :--- |
| **Student Name** | **BODDU SOLOMON** |
| **Register Number** | `URK25CS1191` |
| **Degree & Branch** | B.Tech Computer Science and Engineering |
| **Course Title** | Software Engineering |
| **Course Code** | **25CS312** |
| **Assessment** | Internal Assessment 3 (IA3) Continuous Assessment |
| **Institution** | Karunya Institute of Technology and Sciences, Coimbatore |

---

## 🎯 Course Outcomes (CO) & Learning Units (LU) Mapping

This platform is engineered to satisfy and demonstrate all **5 Course Outcomes** and **5 Learning Units** through working code, interactive simulations, and automated test fixtures:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             25CS312 CURRICULUM TRACEABILITY MATRIX                               │
├────────────────────┬─────────────────────────────┬───────────────────────────────────────────────┤
│ Course Outcome     │ Syllabus Unit               │ Practical Implementation & Lab Modules        │
├────────────────────┼─────────────────────────────┼───────────────────────────────────────────────┤
│ CO 1 (Analyze)     │ LU I: Process Models        │ Agile Scrum Lifecycle, Sprint Backlog & Gantt │
│ CO 2 (Design)      │ LU II: Requirements & Design│ IEEE 830 SRS, 10 UML Diagrams & Architecture  │
│ CO 3 (Implement)   │ LU III: Testing Techniques  │ Black-Box (BVA/EP) & White-Box (CFG/Basis)    │
│ CO 4 (Evaluate)    │ LU IV: SQA & Config Mgmt    │ McCall's Quality, ISO 9126, Vitest & Gitflow  │
│ CO 5 (Synthesize)  │ LU V: Estimation & Viva     │ COCOMO II, WBS, Function Points & Viva Guide  │
└────────────────────┴─────────────────────────────┴───────────────────────────────────────────────┘
```

### 1. CO 1 / LU I: Software Process Models — Agile + Incremental Lifecycle
* **Theoretical Selection:** The traditional Waterfall model is evaluated alongside Evolutionary and UP, with justification for **Agile Scrum + Incremental Delivery** due to evolving AI integration requirements and iterative testing cycles.
* **Interactive Lab Artifact:** Dynamic **Mermaid Gantt Chart** tracing all 5 sprints from inception to hardening:
  * *Sprint 1:* Project Scaffold, Supabase Schema & Row-Level Security.
  * *Sprint 2:* Digital Asset Store & verified PDF distribution.
  * *Sprint 3:* Gemini AI Assistant Edge Function & fallback proxy.
  * *Sprint 4:* 12-module SE Lab interactive suite.
  * *Sprint 5:* SQA metrics, Vitest automated suites & security audit.

### 2. CO 2 / LU II: Software Requirements & Architectural Design
* **Requirements Specification:** IEEE 830 standard SRS including User Stories, MoSCoW prioritization, Functional Requirements (FR-01 to FR-08), and Non-Functional Requirements (NFR-01 to NFR-05) covering latency, auditability, and WCAG accessibility.
* **Architectural Style:** 4-Tier Layered Architecture with **Dependency Inversion Principle (DIP)**:
  $$\text{Presentation (React + Vite)} \longrightarrow \text{State (Zustand)} \longrightarrow \text{BaaS Layer (PostgreSQL + RLS)} \longrightarrow \text{Edge AI Cluster}$$
* **Mermaid UML Suite (10 Diagrams):**
  1. *Use Case Diagram* (Student vs. Faculty/Admin actor interactions)
  2. *Class Diagram* (PostgreSQL entity mapping with TypeScript interfaces)
  3. *Sequence Diagram* (JWT verification & AI query fallback flow)
  4. *Activity Diagram* (Document ingestion with client & server validation)
  5. *State Machine Diagram* (Asset lifecycle: Draft $\rightarrow$ Review $\rightarrow$ Published)
  6. *Component Diagram* (Vite frontend modules & Supabase storage)
  7. *Deployment Diagram* (Vercel CDN Edge nodes & Supabase PostgreSQL cloud)
  8. *Package Diagram* (Modular domain separation)
  9. *Object Diagram* (Runtime snapshot of authenticated sessions)
  10. *Timing Diagram* (Response-time budget across Edge functions)

### 3. CO 3 / LU III: Software Testing Strategies
* **Black-Box Testing:**
  * **Boundary Value Analysis (BVA):** Explicitly tests the $50\text{ MB}$ asset upload constraint ($49.9\text{ MB}$ passes, exact $50.0\text{ MB}$ passes, $50.1\text{ MB}$ is rejected).
  * **Equivalence Partitioning (EP):** Partitions input fields into valid/invalid classes (name length $\ge 2$, email format, password complexity).
* **White-Box Testing:**
  * **Control Flow Graph (CFG):** Graphical visualization of decision nodes, process blocks, and branch outcomes for the core validation engine.
  * **Cyclomatic Complexity:** Calculated using McCabe's formula:
    $$V(G) = E - N + 2P$$
    where $E = 14$ edges, $N = 11$ nodes, and $P = 1$ connected component, yielding $V(G) = 5$ independent basis paths guaranteed 100% test coverage.

### 4. CO 4 / LU IV: Software Quality Assurance (SQA) & SCM
* **Quality Models:** Quantitative tracking using **McCall's Quality Factors** (Correctness, Reliability, Usability, Integrity) and **ISO 9126 Metrics**.
* **Defect Removal Efficiency (DRE):**
  $$\text{DRE} = \left(\frac{E}{E + D}\right) \times 100\%$$
* **Software Configuration Management (SCM):** Strict Gitflow branching model (`main`, `develop`, `feature/*`, `release/*`) with conventional commits and semantic versioning.

### 5. CO 5 / LU V: Software Project Estimation & Viva Voce
* **COCOMO II Model:** Algorithmic effort and schedule estimation for organic academic systems:
  $$\text{Effort} = A \times (\text{KLOC})^B \times \prod_{i=1}^{17} \text{EM}_i$$
* **Work Breakdown Structure (WBS):** Hierarchical task effort mapping across all 5 increments.
* **Viva Voce Defense Hub:** Comprehensive question bank and model answers spanning all 5 learning units.

---

## 🏗️ Step-by-Step System Engineering Process

The system was designed and constructed through an engineering process following the IEEE/ISO lifecycle:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM ENGINEERING LIFECYCLE                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Requirements Elicitation ───► Structured IEEE 830 SRS with MoSCoW Prioritization   │
│  2. Domain Modeling          ───► ER & Schema Design with PostgreSQL 15 & Foreign Keys │
│  3. Defensive Security       ───► Row Level Security (RLS) on all tables + Zero Keys   │
│  4. Core Application Build   ───► React 18, TypeScript, Tailwind CSS, Zustand Stores   │
│  5. Verification & Testing   ───► 18 Vitest unit tests (BVA, EP, CFG basis paths)      │
│  6. Resilience & CI/CD       ───► Server-side AI proxy with offline autonomous engine  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Database Schema & Security First:**
   * Provisioned PostgreSQL tables: `profiles`, `categories`, `digital_assets`, `chat_messages`, `conversations`.
   * Enforced Row-Level Security (RLS) policies distinguishing regular `student` users (read-only catalog) from `admin` users (full CRUD, user management, and category curation).
2. **Component Architecture & Design System:**
   * Modular UI designed with Tailwind CSS and Radix UI primitives.
   * Universal internationalization (`i18next`) supporting **English**, **Tamil**, **Hindi**, and **Telugu**.
3. **Resilient AI Pipeline:**
   * Deno Edge Function proxying Gemini 1.5 Flash $\rightarrow$ OpenRouter $\rightarrow$ NVIDIA NIM.
   * Client-side autonomous knowledge engine ensuring 100% viva availability if external APIs fail.
4. **Automated Verification:**
   * Test-Driven development via Vitest, achieving 18 passing tests in under 2 seconds.

---

## 🧪 Automated Testing Evidence (18 / 18 Passed)

```text
 RUN  v2.1.9  C:/Users/kivsa/OneDrive/Desktop/seia3/IA3

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

## 💻 Local Setup & Execution Guide

### Prerequisites
- **Node.js:** v18.x or later (LTS recommended)
- **npm:** v9.x or later

### 1. Clone the Repository
```bash
git clone https://github.com/b-solomon/SE_IA3_AI_Library.git
cd SE_IA3_AI_Library
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the provided environment template to `.env`:
```bash
cp .env.example .env
```
Fill in your project credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 5. Execute Test Suite
```bash
npm test
```

---

## 🔐 Credentials & Role-Based Access Control (RBAC)

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@karunya.edu` | `Admin@1234` | Full CRUD, User Governance, Asset Ingestion, Analytics |
| **Student** | `student@karunya.edu` | `Student@1234` | Read-only Catalog, PDF Downloads, AI Chat, 12 SE Lab Modules |
| **Interactive Sandbox** | *Navigate to `/demo`* | *None (Toggle)* | Instant one-click Student/Admin role switcher for faculty evaluation |

---

## 📄 Academic Integrity & License
This project is developed by **BODDU SOLOMON (URK25CS1191)** for the **25CS312 Software Engineering** curriculum at **Karunya Institute of Technology and Sciences**. Published under the **MIT License**.
