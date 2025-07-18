# WhatsApp Business API Management App

This is a simple web application to demonstrate two key features of the WhatsApp Business API:
1.  **Sending a text message** to a WhatsApp number.
2.  **Creating a message template**.

The application is built with a React frontend and a Node.js/Express backend.

## Project Structure

```
/
├── backend/         # Node.js Express server
│   ├── node_modules/
│   ├── package.json
│   ├── server.js
│   └── .env           # (You need to create this)
├── frontend/        # React client
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

## Setup and Installation

### 1. Prerequisites

*   Node.js and npm installed on your machine.
*   A Meta Developer Account and a Meta App with the `WhatsApp Business Platform` configured.
*   Required permissions for your App: `whatsapp_business_messaging` and `whatsapp_business_management`.
*   A test phone number linked to your WhatsApp Business Account.
*   Your **Access Token**, **Phone Number ID**, and **WhatsApp Business Account ID** from the Meta App Dashboard.

### 2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a `.env` file:**
    Create a new file named `.env` in the `backend` directory and add the following content. Replace the placeholder values with your actual credentials from the Meta Developer Dashboard.

    ```env
    # Get your token from Meta App Dashboard -> WhatsApp -> API Setup
    WHATSAPP_TOKEN=YOUR_WHATSAPP_TOKEN

    # Get your Phone Number ID from Meta App Dashboard -> WhatsApp -> API Setup
    PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID

    # The API version you want to use (e.g., v18.0)
    GRAPH_API_VERSION=v18.0

    # Get it from your Business Manager -> Business Settings -> Accounts -> WhatsApp Accounts
    WHATSAPP_BUSINESS_ACCOUNT_ID=YOUR_WHATSAPP_BUSINESS_ACCOUNT_ID
    ```

3.  **Install dependencies (if you haven't already):**
    ```bash
    npm install
    ```

4.  **Start the backend server:**
    ```bash
    node server.js
    ```
    The backend server will start on `http://localhost:5001`.

### 3. Frontend Setup

1.  **Open a new terminal** and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  **Install dependencies (if you haven't already):**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.

## How to Record the Required Videos

Once both the backend and frontend servers are running, you can proceed to record the videos for your submission.

### Video 1: Sending a Message

1.  Open the web application in your browser (`http://localhost:3000`).
2.  On the "Send Message" page, enter the recipient's phone number (including country code, without `+` or `00`).
3.  Type a message in the message box.
4.  Have WhatsApp Web (`web.whatsapp.com`) or your mobile WhatsApp open to the chat with the recipient number.
5.  Start your screen recording.
6.  Click the "Send Message" button in your web app.
7.  The video should clearly show the message being sent from your app and appearing almost instantly in the WhatsApp interface.
8.  Stop the recording.

### Video 2: Creating a Message Template

1.  In the web application, navigate to the "Create Template" page using the navigation bar.
2.  Start your screen recording.
3.  Fill out the template creation form:
    *   **Template Name:** Use a unique, descriptive name in lowercase with underscores (e.g., `shipping_update_123`).
    *   **Language:** Select a language.
    *   **Category:** Choose a category like `MARKETING` or `TRANSACTIONAL`.
    *   **Body Text:** Write the content of your template. You can include variables like `{{1}}`.
    *   Fill in the optional Header and Footer fields if you wish.
4.  Click the "Create Template" button.
5.  The video should show the form being filled and the success message that appears after the template is submitted for review.
6.  You can optionally show the newly created template pending review in your WhatsApp Manager.
7.  Stop the recording. 