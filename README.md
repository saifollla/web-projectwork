# GigaChat

GigaChat is a full-stack web application developed as a collaborative university project. The platform facilitates real-time communication and robust data management, leveraging a modern tech stack for high performance and scalability.

## 👥 The Team
* **Sachkov Ilya** - Full Stack Developer
* **Safiyulla Aizere** - Frontend Specialist
* **Yelubayev Ilyas** - Backend Specialist

---

## 🚀 Tech Stack

### Backend
* **Framework:** Django 5.x
* **Language:** Python 3.11+
* **Database:** SQLite (Development)
* **Features:** RESTful API, Token Authentication, Django Models

### Frontend
* **Framework:** Angular 17+
* **Language:** TypeScript
* **Styling:** CSS

---

## 🛠️ Installation & Setup

### 1. Prerequisites
Ensure you have the following installed:
* Python (v3.11 or higher)
* Node.js (v18 or higher) & npm
* Angular CLI (`npm install -g @angular/cli`)

### 2. Backend Setup (Django)
```bash
# Clone the repository
git clone https://github.com/saifollla/web-projectwork.git
cd backend

# Create and activate virtual environment
python -m venv .venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup (Angular)
```bash 
cd frontend
ng serve
```