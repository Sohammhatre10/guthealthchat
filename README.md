# Project Setup and Usage

This project consists of two main parts: an AI backend and a React-based frontend application.

## 1. AI Backend Setup

This section details how to set up and run the AI backend, responsible for data processing and LLM inference.

### Prerequisites

- Python 3.8+
- pip (Python package installer)

### Installation

1.  Navigate to the `AI` directory:
    ```bash
    cd AI
    ```
2.  Create a virtual environment (recommended):
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    - On Windows:
      ```bash
      .\venv\Scripts\activate
      ```
    - On macOS/Linux:
      ```bash
      source venv/bin/activate
      ```
4.  Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

### Running the AI Backend

After installation, you can run the backend:

1.  Ensure your virtual environment is activated.
2.  Run the main application (assuming `main.py` starts the FastAPI server):
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```
    (Adjust `main:app`, host, and port if your `main.py` uses a different FastAPI app instance name or needs a specific port.)

## 2. Frontend Application Setup

This section details how to set up and run the React frontend, which interacts with the AI backend.

### Prerequisites

- Node.js (LTS version recommended)
- npm (Node Package Manager) or yarn

### Installation

1.  Navigate to the `project` directory:
    ```bash
    cd project
    ```
2.  Install the Node.js dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Frontend Application

After installation, you can run the frontend:

1.  Ensure you are in the `project` directory.
2.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
3.  The application will typically be accessible at `http://localhost:5173` (or a similar port, as indicated by the terminal output).

## Project Workflow (High-Level)

1.  **Data Scraping & Cleaning:** `data_scrapper.py` is used to collect raw data, which is then processed and stored (e.g., in `cleaned_json.json` or a database). This data serves as the knowledge base for the LLM.
2.  **LLM Inference:** The AI backend (`main.py`) uses the cleaned data to generate responses based on user queries, leveraging libraries like `transformers`, `langchain`, and `faiss-cpu` for efficient data retrieval and model interaction.
3.  **Frontend Interaction:** The frontend (`App.tsx`, `components/`) provides a user interface for interacting with the AI. User queries are sent to the backend, and the LLM's responses are displayed.
