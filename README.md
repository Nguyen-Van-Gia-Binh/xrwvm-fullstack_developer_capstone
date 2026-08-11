# xAutomotive - Cars Dealership Full Stack Web Application

## Project Overview

xAutomotive is a national car dealership web application built as the IBM Full Stack Developer Capstone project. The platform allows users to browse dealership branches across the United States, view and submit customer reviews, and access detailed information about car makes and models.

## Features

- 🚗 Browse all dealership branches nationwide
- 🔍 Filter dealerships by state
- ⭐ View and submit customer reviews
- 🔐 User authentication (login/register/logout)
- 💬 Sentiment analysis on reviews (Positive/Negative/Neutral)
- 📊 Admin panel for managing car makes and models
- 📱 Responsive design with React frontend

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend | Django (Python) |
| Database | SQLite (Django), MongoDB (reviews/dealers) |
| Microservice | Node.js + Express |
| Sentiment Analysis | Flask / keyword-based |
| CI/CD | GitHub Actions |
| Containerization | Docker |
| Deployment | Railway |

## Project Structure

```
xrwvm-fullstack_developer_capstone/
├── .github/workflows/     # CI/CD - GitHub Actions
├── server/
│   ├── djangoapp/         # Django app (models, views, urls)
│   ├── djangoproj/        # Django project settings
│   ├── frontend/
│   │   ├── static/        # About.html, Contact.html, CSS
│   │   └── src/
│   │       └── components/
│   │           ├── Header/
│   │           ├── Register/
│   │           ├── Login/
│   │           └── Dealers/
│   └── database/
│       └── backend/       # Node.js Express microservice
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm 9+
- Docker (optional)

### Backend Setup (Django)

```bash
cd server
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Microservice Setup (Node.js)

```bash
cd server/database/backend
npm install
node app.js
```

### Frontend Setup (React)

```bash
cd server/frontend
npm install
npm run build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/djangoapp/get_dealers` | Get all dealers |
| GET | `/djangoapp/get_dealers/{state}` | Get dealers by state |
| GET | `/djangoapp/get_dealer/{id}` | Get dealer by ID |
| GET | `/djangoapp/reviews/dealer/{id}` | Get reviews for a dealer |
| POST | `/djangoapp/add_review` | Add a new review |
| GET | `/djangoapp/get_cars` | Get all car makes and models |
| POST | `/djangoapp/login` | User login |
| GET | `/djangoapp/logout` | User logout |
| POST | `/djangoapp/register` | User registration |
| GET | `/djangoapp/analyze_review/{text}` | Analyze review sentiment |

## Author

**Nguyen Van Gia Binh** - IBM Full Stack Software Developer Capstone Project

## License

This project is part of the IBM Full Stack Software Developer Professional Certificate program.
