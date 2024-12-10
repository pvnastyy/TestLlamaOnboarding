#!/bin/bash

# Exit script on any error
set -e

echo "Starting the setup process..."

# Backend setup
echo "Setting up the backend..."

# Navigate to the backend directory
cd chatbot-backend

# Check if Python virtual environment exists, if not create it
if [ ! -d "llama-env" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv llama-env
fi

# Activate the virtual environment
source llama-env/bin/activate
echo "Installing backend dependencies..."
pip install --upgrade pip
pip install torch transformers flask flask-cors pytesseract Pillow

deactivate
echo "Backend setup complete."

# Frontend setup
echo "Setting up the frontend..."
cd ../chatbot-frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "Frontend setup complete."
echo "Starting backend and frontend servers..."

# Navigate to root directory
cd ..

# Start backend and frontend in parallel, maybe I should implement a pause as the LLaMA model will take some time.
gnome-terminal --tab --title="Backend" -- bash -c "cd chatbot-backend && source llama-env/bin/activate && python llama_server.py"
gnome-terminal --tab --title="Frontend" -- bash -c "cd chatbot-frontend && npm start"

echo "Servers are running. Access the chatbot at http://localhost:3000"