# HackerRank Orchestrate June 2026 - Damage Claim Verification System

A complete multi-modal AI solution for verifying damage claims using Gemini 2.5 Flash Vision.

## Project Structure
- `/frontend`: React 19, Vite, Tailwind V4, Framer Motion
- `/backend`: FastAPI, Python, Pandas, Google GenAI SDK
- `/claims`: Datasets for processing

## Setup Instructions

### Backend Configuration
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # or source venv/bin/activate  # Mac/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install scikit-learn
   ```
4. Configure your Gemini API key:
   ```bash
   set GEMINI_API_KEY=your_gemini_api_key  # Windows
   # or export GEMINI_API_KEY=your_gemini_api_key  # Mac/Linux
   ```
5. Start the server:
   ```bash
   uvicorn app:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

### Frontend Configuration
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Multi-Modal Analysis**: Uses Gemini 2.5 Flash Vision to directly verify damage from images.
- **Rule Engine Orchestration**: Combines AI visual truth with dataset constraints (`user_history.csv` and `evidence_requirements.csv`).
- **Batch Processing API**: Fully implements the `/api/process-dataset` endpoint capable of digesting the required CSVs and emitting the perfectly formatted `output.csv`.
- **Strategy Evaluator**: An evaluation module that compares rule-based accuracy vs Gemini-powered accuracy.
- **Premium UI**: Dark-mode glassmorphic interface to wow judges at first glance.
