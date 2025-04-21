# Medical Appointment System - Frontend

This repository contains the frontend application for a medical appointment system, built with SvelteKit. The application provides an intuitive user interface for managing doctors, patients, and medical appointments.

## Overview

The frontend component is designed to work with the backend services defined in the [P1-Backend repository](https://github.com/Actividades-Arqui-2510/P1-Backend). It provides:

* User interfaces for patient and doctor management
* Appointment scheduling and management
* Integration with SOAP web services
* Responsive design for both desktop and mobile use

## Technologies

* **SvelteKit**: Application framework
* **Svelte**: Core UI framework
* **TypeScript**: Type-safe JavaScript
* **SOAP Client**: Backend service integration
* **Vite**: Build tool
* **Docker**: Containerization

## Project Structure

```
P1-Front/
├── src/
│   ├── lib/
│   │   ├── components/ # Reusable UI components
│   │   ├── services/   # SOAP client services
│   │   ├── types/      # TypeScript definitions
│   │   └── config/     # Proyect configurations
│   ├── routes/         # SvelteKit routes
│   │   ├── doctors/    # Doctor management pages
│   │   ├── patients/   # Patient management pages
│   ├── app.html        # HTML template
├── static/             # Static assets
├── svelte.config.js    # Svelte configuration
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## Features

The frontend application includes the following features:

* **Authentication**
  * User login (patients and doctors)
  * Registration for new patients
  * Registration for new doctors
  * Profile management

* **Patient Features**
  * View personal information
  * Schedule new appointments
  * View appointment history
  * Cancel or reschedule appointments

* **Doctor Features**
  * Manage professional profile
  * View scheduled appointments
  * Patient history access
  * Appointment management

* **Appointment Management**
  * Calendar view of appointments
  * Time slot selection
  * Specialty filtering
  * Appointment confirmation and reminders

## Development Setup

### Prerequisites
* Node.js 16+
* npm or yarn
* Backend services (see P1-Backend repository)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Actividades-Arqui-2510/P1-Front.git
cd P1-Front
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Configure environment variables:
   * Create a `.env` file based on `.env.example`
   * Set the backend SOAP service URLs

4. Start the development server:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:
```bash
npm run build
```

## Docker Deployment

The repository includes Docker configuration for containerized deployment:

```bash
# Build the Docker image
docker build -t p1-frontend .

# Run the container (standalone)
docker run -p 3000:3000 p1-frontend
```

## Environment Variables

The Docker container accepts the following environment variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| BACKEND_URL | Backend SOAP service base URL | http://backend:8080 |
| API_TIMEOUT | API request timeout (ms) | 30000 |
| PUBLIC_BASE_URL | Public-facing URL of the app | http://localhost:3000 |

## Integration with P1-Infrastructure

For full system deployment, this frontend should be used with the [P1-Backend repository](https://github.com/Actividades-Arqui-2510/P1-Infrastructure) repository, which provides:
* Container orchestration with Docker Compose
* Environment configuration
* Health monitoring

Refer to the P1-Infrastructure README for complete system deployment instructions.