# ✈️ AeroInsight — Frontend

> **Aviation Intelligence & Network Planning Dashboard**

The **AeroInsight Frontend** is the React-based user interface for the AeroInsight aviation intelligence platform.

It provides an interactive dashboard for exploring airport intelligence, network planning, fleet information, weather intelligence, route analysis, and aviation-focused analytics.

The frontend communicates with a separate **FastAPI backend** through REST APIs.

---

## 🚀 Project Status

**Active Development**

The frontend has evolved from an initial aviation analytics dashboard into a more focused **Aviation Intelligence & Network Planning interface**.

Current frontend modules include:

* 🛫 Airport Intelligence
* 🌐 Network Planner
* ✈️ Fleet Intelligence
* 🌦️ Weather Intelligence
* 📊 Analytics
* 🛣️ Route Analysis
* 📈 Demand Forecasting
* 🔎 Airport Search
* 📋 Route and airport information cards

The UI is continuously being refined with a focus on usability, clean information hierarchy, and aviation-oriented data visualization.

---

## 🎯 Purpose

The purpose of the AeroInsight frontend is to provide a centralized interface through which users can explore aviation data and interact with network planning functionality.

The frontend is designed to make complex aviation information easier to understand through:

* Interactive dashboards
* Structured information cards
* Airport search
* Route planning interfaces
* Fleet statistics
* Weather information
* Forecasting interfaces
* Analytical views

The long-term goal is to provide a frontend capable of supporting **data-driven aviation network planning decisions**.

---

## 🖥️ Tech Stack

### Core

* React
* Vite
* JavaScript
* HTML5
* CSS3

### Frontend Architecture

* React Components
* React Pages
* REST API integration
* Reusable UI components
* Client-side state management

### Backend Communication

The frontend communicates with the AeroInsight FastAPI backend using HTTP requests.

```text
React
  ↓
REST API
  ↓
FastAPI
  ↓
PostgreSQL
```

---

## 🧩 Main Modules

### 🛫 Airport Intelligence

Provides an interface for searching and exploring airport information.

Users can work with:

* IATA codes
* ICAO codes
* Airport names
* Cities
* Airport coordinates
* Airport metadata
* Airport statistics

The frontend communicates with the backend airport APIs to retrieve this information.

---

### 🌐 Network Planner

The Network Planner is one of the primary modules of AeroInsight.

It provides an interface for evaluating potential routes between airports.

Current functionality includes:

* Origin airport selection
* Destination airport selection
* Airport search
* Aircraft selection
* Flights-per-day input
* Seasonal parameters
* Route analysis
* Demand forecasting
* Weather-related route considerations

The Network Planner is being developed toward more advanced **what-if analysis and route optimization**.

---

### ✈️ Fleet Intelligence

The Fleet section provides a visual overview of aircraft-related information.

Current frontend functionality includes:

* Fleet overview
* Total aircraft statistics
* Manufacturer information
* Aircraft type information
* Fleet statistics

Aircraft types used within the Network Planner include:

* A320
* A321neo
* B737 MAX
* B777
* ATR 72

---

### 🌦️ Weather Intelligence

Weather information is incorporated into the frontend to provide additional operational context for aviation analysis.

The interface supports weather-related information including:

* Current conditions
* Forecast information
* METAR data
* TAF information
* SIGMET information
* Weather risk indicators

Weather intelligence is particularly relevant to the Network Planner and route analysis workflow.

---

### 📊 Analytics

The Analytics section provides a foundation for presenting aviation-related data in a more analytical format.

The frontend is designed to progressively incorporate:

* Airport statistics
* Network information
* Fleet statistics
* Route information
* Weather intelligence
* Forecasting data

---

## 🏗️ Frontend Architecture

The frontend follows a component-based React architecture.

```text
                    AeroInsight Frontend
                            │
                            ▼
                       React / Vite
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          Pages        Components      API Services
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                       FastAPI Backend
                            │
                            ▼
                       PostgreSQL
```

The frontend is intentionally separated from the backend so that UI development and backend development can evolve independently.

---

## 📁 Project Structure

The exact structure continues to evolve, but the frontend follows a structure similar to:

```text
AeroInsight-Frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Airport/
│   │   ├── Fleet/
│   │   ├── Network/
│   │   ├── Weather/
│   │   └── common/
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── AirportIntelligence/
│   │   ├── NetworkPlanner/
│   │   ├── Fleet/
│   │   └── Analytics/
│   │
│   ├── services/
│   │
│   ├── assets/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

> The structure may change as new modules and reusable components are introduced.

---

## 🔌 API Integration

The frontend consumes REST APIs exposed by the AeroInsight FastAPI backend.

For example, airport search follows the backend API pattern:

```text
GET /api/airports/search/{query}
```

The frontend sends the requested airport code or search query to the backend and renders the returned aviation data inside the appropriate UI components.

The frontend does **not** directly access PostgreSQL.

```text
Frontend
   │
   │ HTTP
   ▼
FastAPI
   │
   │ Database queries
   ▼
PostgreSQL
```

This keeps database access isolated within the backend.

---

## ⚙️ Environment Configuration

The frontend uses environment variables for backend configuration.

For local development, create:

```text
.env
```

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production, the variable should point to the deployed FastAPI backend.

Sensitive credentials should never be placed directly inside React source code.

---

## 🛠️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/AeroInsight-Frontend.git
cd AeroInsight-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend URL

Create a `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Make sure the FastAPI backend is running.

### 4. Start the development server

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

## 🏭 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔄 Development Workflow

AeroInsight is being developed as a full-stack project with the frontend and backend maintained separately.

```text
Frontend Repository
        │
        │ REST API
        ▼
Backend Repository
        │
        ▼
PostgreSQL Database
```

Frontend development focuses primarily on:

* UI/UX
* React architecture
* Component design
* API consumption
* Data presentation
* User interactions
* Dashboard experience

Backend development handles:

* Business logic
* Data processing
* API endpoints
* Database operations
* External API integrations
* Aviation data services

---

## 🗺️ Frontend Roadmap

Planned frontend improvements include:

* [ ] Advanced Network Planner interface
* [ ] What-if analysis UI
* [ ] Route profitability visualization
* [ ] Improved demand forecasting visualization
* [ ] Network connectivity visualization
* [ ] Interactive airport maps
* [ ] More advanced fleet analytics
* [ ] Enhanced weather visualization
* [ ] Improved route comparison
* [ ] More reusable dashboard components
* [ ] Further UI/UX refinement
* [ ] Responsive design improvements

---

## 🎨 Design Direction

The AeroInsight interface is designed around a clean, professional aviation dashboard aesthetic.

The current UI direction emphasizes:

* Clean layouts
* High information density without unnecessary clutter
* Clear navigation
* Aviation-focused visual hierarchy
* Reusable cards and components
* Data-driven interfaces
* Professional dashboard presentation

The frontend has also undergone UI/UX refinement to make the application feel more polished and production-oriented.

---

## 🧠 What This Project Demonstrates

The AeroInsight frontend demonstrates practical experience with:

* React application development
* Vite
* Component-based architecture
* REST API integration
* Frontend/backend separation
* Dashboard development
* Data-driven UI
* Aviation domain modeling
* API debugging
* Production API integration
* Full-stack application development

---

## 👨‍💻 Author

**Joshua Joseph**

Junior Python Developer & AI Researcher

AeroInsight is being developed as a portfolio and research-oriented project combining:

**Aviation × Software Engineering × Data × AI**

---

## ⭐ AeroInsight

> **Turning aviation data into actionable intelligence.**
