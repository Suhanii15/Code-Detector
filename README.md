# Code Detector

> An ML-powered GitHub repository analyzer that predicts bug-prone files using repository history and software engineering metrics.

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Express](https://img.shields.io/badge/Backend-Express-black?logo=express)
![Flask](https://img.shields.io/badge/ML-Flask-lightgrey?logo=flask)
![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-orange?logo=scikitlearn)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Overview

Code Detector is a full-stack developer tool that analyzes public GitHub repositories and predicts which source files are most likely to contain defects.

Instead of relying only on static code analysis, it combines repository history, developer activity, and software engineering metrics with a Machine Learning model to estimate bug risk for every file.

The application is built using a microservice architecture consisting of:

- React Frontend
- Express.js Backend
- Flask ML Service
- MongoDB Cache
- GitHub REST API

---

## Features

- Analyze any public GitHub repository
- ML-based bug risk prediction
- Repository health overview
- File-level risk scores
- Repository hotspot detection
- Explainable predictions
- Actionable code quality recommendations
- Intelligent caching with automatic repository freshness checks
- Responsive dashboard with interactive file inspection

---
## Demo
https://drive.google.com/file/d/1UAneU2AuPUenUzsT-pQ5pw3ebxKvDU92/view?usp=sharing


<h2>Analyze Flow</h2>

<p align="center">
  <img src="https://github.com/user-attachments/assets/8469c937-fcb5-43db-9b3c-fbbb5281166f" width="48%">
  <img src="https://github.com/user-attachments/assets/e448de71-4070-4eee-b155-dbf4c6aad29f" width="48%">
</p>

<h2>Dashboard</h2>

<p align="center">
  <img src="https://github.com/user-attachments/assets/cb91145c-451b-4213-b979-aed22167123b" width="90%">
</p>

<h2>File Details</h2>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6e98a05a-729c-4d40-90f1-de53fac70ff9" width="90%">
</p>

---

# Machine Learning Pipeline

## 1. Data Collection

Repository metadata is collected using the GitHub REST API.

For each source file, the application retrieves:

- File contents
- Commit history
- Contributors
- Repository metadata

---

## 2. Feature Engineering

The following features are extracted:

| Feature | Description |
|----------|-------------|
| LOC | Lines of Code |
| Churn Rate | Number of commits affecting the file |
| Cyclomatic Complexity | Estimated control flow complexity |
| Comment Density | Ratio of comment lines to total lines |
| Unique Authors | Number of contributors |
| Bug Fix Percentage | Ratio of bug-fixing commits |

---

## 3. Model Training

The dataset is cleaned and preprocessed before training.

The project uses a **Gradient Boosting Classifier** for defect prediction.

Training pipeline includes:

- Data Cleaning
- Feature Scaling
- Train/Test Split
- 5-Fold Cross Validation
- ROC-AUC Evaluation
- Feature Importance Analysis

---

## Prediction Workflow

```text
GitHub Repository
        │
        ▼
Fetch Repository Tree
        │
        ▼
Download File Content
        │
        ▼
Extract Software Metrics
        │
        ▼
Generate Feature Vector
        │
        ▼
ML Prediction
        │
        ▼
Repository Dashboard
```
# Getting Started

## Clone Repository

```bash
git clone https://github.com/your-username/Code-Detector.git

cd Code-Detector
```

---

## Backend

```bash
cd server

npm install

npm start
```

---

## ML Service

```bash
cd ml-service

pip install -r requirements.txt

python app.py
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

## Backend (.env)

```
PORT=5000

MONGODB_URI=your_mongodb_connection

GITHUB_TOKEN=your_github_token

ML_SERVICE=http://localhost:5001
```

---

## ML Service (.env)

```
FLASK_ENV=development
```

---

# Future Improvements

- GitHub OAuth Authentication
- Pull Request Analysis
- Historical Trend Comparison
- Team-Level Risk Analytics
- CI/CD Integration
- IDE Extension
- Deep Learning-Based Defect Prediction

---




