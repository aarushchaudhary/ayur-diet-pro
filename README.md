# Ayur-Diet-Pro: Ayurvedic Diet Management Software

Ayur-Diet-Pro is a comprehensive, full-stack web application designed to assist Ayurvedic practitioners in managing patient information, creating personalized diet charts, and analyzing nutritional data through the lens of Ayurvedic principles.

## Key Features

  * **Patient Management:** Securely create, read, update, and delete detailed patient profiles, including personal, medical, and lifestyle information.
  * **Dynamic Diet Chart Creation:** Build customized diet plans for patients with an intuitive interface, specifying meals and food items for each day.
  * **Extensive Food Database:** Browse and manage a large database of food items, complete with nutritional information (calories, macros) and Ayurvedic properties (`Rasa`, `Virya`, `Dosha` effects).
  * **Recipe Builder:** Create and save complex recipes, which can then be easily added to any patient's diet chart.
  * **Insightful Analytics:** Automatically generate and visualize analytics for each diet chart, showing the balance of macronutrients, tastes (`Rasa`), and energetic effects (`Virya`).
  * **Secure Authentication:** A robust user authentication system using JSON Web Tokens (JWT) ensures that all patient and practitioner data is kept secure.

## Tech Stack

The application is built using the MERN stack and other modern technologies.

### Frontend

  * **React:** A declarative, component-based library for building user interfaces.
  * **React Router:** For client-side routing and navigation.
  * **Axios:** A promise-based HTTP client for making API requests to the backend.
  * **ApexCharts:** For creating interactive and responsive data visualizations and charts.

### Backend

  * **Node.js & Express:** A runtime environment and web framework for building fast and scalable server-side applications.
  * **MongoDB:** A NoSQL database for storing application data, with Mongoose as the ODM for data modeling.
  * **JSON Web Tokens (JWT):** For implementing a secure and stateless authentication strategy.
  * **Bcrypt.js:** For hashing user passwords before storing them in the database.

## Project Structure

The project is organized into a standard monorepo structure with two main directories: `client` and `server`.

```
/
├── client/         # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── services/
│       └── views/
└── server/         # Node.js & Express Backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    └── routes/
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js (`v14` or later)
  * npm (comes with Node.js)
  * MongoDB (local installation or a cloud service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/ayur-diet-pro.git
    cd ayur-diet-pro
    ```

2.  **Set up the Backend:**

    ```sh
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create a .env file in the /server directory and add the following variables:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000

    # Start the backend server
    npm start
    ```

3.  **Set up the Frontend:**

    ```sh
    # Navigate to the client directory from the root
    cd ../client

    # Install dependencies
    npm install

    # Start the React development server
    npm start
    ```

The application should now be running. You can access the frontend at `http://localhost:3000` and the backend server will be listening on `http://localhost:5000`.