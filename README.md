# Canvas Assignment

This is a full-stack application for creating and interacting with a canvas, allowing users to draw shapes, add text, and export the canvas in various formats.

## Project Structure

### Client

The client-side of the application is built using React and Tailwind CSS.

#### Directory Structure

```
client/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vite.config.js
```

### Server

The server-side is built using Node.js with Express.

#### Directory Structure

```
server/
├── controllers/
│   ├── downloads/
│   ├── canvasController.js
│   ├── helloController.js
├── middlewares/
├── routes/
│   ├── canvasRoute.js
│   ├── helloRoute.js
├── utils/
├── .dockerignore
├── .env
├── .gitignore
├── app.js
├── dockerfile
├── package-lock.json
├── package.json
├── server.js
├── LICENSE
├── README.md
```

## Features

- **Client**:

  - Drawing tools: rectangle, circle, and text.
  - Export canvas as HTML, SVG, or PNG.
  - Clear the canvas.
  - Responsive design using Tailwind CSS.

- **Server**:
  - RESTful API endpoints for canvas operations.
  - File export and download capabilities.

## Setup Instructions

### Prerequisites

- Node.js
- Docker (optional, for containerization)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd canvas-assignment
```

#### 2. Install Dependencies

For client:

```bash
cd client
npm install
```

For server:

```bash
cd server
npm install
```

#### 3. Start the Application

Start the client:

```bash
cd client
npm run dev
```

Start the server:

```bash
cd server
npm start
```

The client will be available at `http://localhost:5173` (if using Vite) and the server at `http://localhost:5000`.

## API Endpoints

### Canvas API

- `POST /canvas/create`: Create a new canvas.
- `POST /canvas/draw-element`: Draw a shape (circle or rectangle).
- `POST /canvas/draw-text`: Add text to the canvas.
- `POST /canvas/clear`: Clear the canvas.
- `GET /canvas/export-html`: Export canvas as HTML.
- `GET /canvas/export-svg`: Export canvas as SVG.
- `GET /canvas/download`: Download canvas as PNG.

### Hello API

- `GET /hello`: Health check for the server.

## Environment Variables

Create a `.env` file in the `server` directory with the following content:

```
PORT=8000
```

## Docker Instructions

### Build the Docker Image

```bash
docker build -t canvas-assignment .
```

### Run the Docker Container

```bash
docker run -p 8000:8000 canvas-assignment
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Author

Adarsh G S (100percentBAKA)
