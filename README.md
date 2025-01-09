# Alert System using SMTP Server

A backend system that monitors POST requests and sends alerts via SMTP server for failed authentication attempts. Built with Node.js, Express.js, and MongoDB.

## Features

- Monitors POST endpoint for failed requests
- Tracks invalid requests from IP addresses within configurable time windows
- Sends email alerts using Google's SMTP server when threshold is exceeded
- Logs and stores metrics for failed requests
- Exposes endpoint for metrics retrieval

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager
- Google account for SMTP services

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ShouryaPal/alert-system.git
cd alert-system
```

2. Install dependencies:
```bash
npm install
```

3. Download the `.env` file from [Google Drive](https://drive.google.com/file/d/1hg35GyE_Y4yKKtS28sFyu6liOHf2Dnz0/view?usp=sharing) and place it in the root directory.

4. Configure environment variables in `.env`:
```plaintext
DATABASE_URL="mongodb://your-mongodb-url/request-monitor"
UPSTASH_REDIS_URL="your-upstash-redis-url"
UPSTASH_REDIS_TOKEN="your-upstash-redis-token"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"
ALERT_RECIPIENT="admin@yourdomain.com"
```

## Usage

1. Start the server:
```bash
npm start
```

2. The server will start running on `http://localhost:3000`

## API Endpoints

### POST /api/submit
- Endpoint for monitoring failed requests
- Requires authentication headers
- Returns appropriate status codes based on validation

### GET /api/metrics
- Retrieves logged metrics of failed requests
- Includes IP addresses, timestamps, and failure reasons
