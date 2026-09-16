
# 🛠️ ITSM Platform — Tunisair

A full-scale IT Service Management (ITIL) platform with automated incident
and problem workflow management, an AI module for intelligent PDF document
analysis, and an end-to-end CI/CD pipeline.
Developed during a software engineering internship at Tunisair,
the Tunisian national airline.

<img width="571" height="571" alt="usescasesglob" src="https://github.com/user-attachments/assets/894e0ab4-0171-4f1f-8637-0e9ed1416725" />

## ✨ Features

- Automated incident and problem workflow management powered by Spring StateMachine
- AI module (Python / Flask + LLM) for intelligent PDF document analysis (RAG)
- Complex Angular interfaces: FullCalendar, ngx-datatable, multi-step form wizards
- End-to-end CI/CD pipelines: Jenkins, Docker, SonarQube, Nexus
- Unit and integration tests covering all state machine transitions and business logic
- Full delivery lifecycle ownership: analysis, design, development, testing, and release

## 🛠️ Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Backend    | Java 17, Spring Boot, Spring StateMachine, Swagger |
| AI Module  | Python, Flask, LLM (RAG + ChromaDB)                |
| Frontend   | Angular 14, TypeScript                             |
| Database   | MySQL                                              |
| CI/CD      | Jenkins, Docker, SonarQube, Nexus                  |
| Process    | ITIL, Scrum                                        |

## 🚀 Getting Started

### Prerequisites

- Java 17
- Node.js and npm
- Python 3
- MySQL

<img width="2500" height="1592" alt="classdiagram" src="https://github.com/user-attachments/assets/c9deb076-e73f-464c-b50b-326e5e996a36" />


### Backend

    cd backend
    mvn spring-boot:run

API runs at `http://localhost:8080` — Swagger UI at `/swagger-ui.html`.

### AI Module

    cd rag-ai
    pip install -r requirements.txt

    <img width="1536" height="932" alt="chatbot" src="https://github.com/user-attachments/assets/706a0a49-f336-4651-b148-e3920f824575" />


### Frontend

    cd front/pfe_front
    npm install
    ng serve

Then open `http://localhost:4200` in your browser.

## 📁 Project Structure

    ├── backend/         # Spring Boot REST API + StateMachine workflows
    ├── front/           # Angular application
    ├── rag-ai/          # Flask AI module for PDF document analysis
    └── Jenkinsfile      # CI/CD pipeline definition


---

*Developed during a software engineering internship at Tunisair (Tunisian national airline).*


<img width="429" height="579" alt="User_Incident_Change" src="https://github.com/user-attachments/assets/cfccbb27-3aff-4c76-b41f-8046c356411e" />
<img width="771" height="641" alt="uses" src="https://github.com/user-attachments/assets/03e02c42-b07e-4fe5-a4d1-371b05909137" />
<img width="771" height="631" alt="uses_case" src="https://github.com/user-attachments/assets/7b3daf71-c790-475f-9899-624b90a264c3" />


<img width="541" height="644" alt="1" src="https://github.com/user-attachments/assets/b693f589-6812-4101-9227-99a5c5de72d6" />

<img width="1342" height="636" alt="7" src="https://github.com/user-attachments/assets/34950827-e457-4930-9cc1-1ff55d6d3ded" />
<img width="1122" height="642" alt="incident1" src="https://github.com/user-attachments/assets/d5c53d05-f2f4-48aa-82ce-d724a8794a0a" />

<img width="652" height="640" alt="3" src="https://github.com/user-attachments/assets/a34981c4-6fd1-40c1-a8d6-207396a2e7b1" />
<img width="424" height="533" alt="token" src="https://github.com/user-attachments/assets/c5564c48-a8fb-4617-a756-36496702f47b" />


