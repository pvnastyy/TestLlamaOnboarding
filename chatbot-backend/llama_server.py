from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load LLaMA model and tokenizer
MODEL_NAME = "meta-llama/Llama-2-7b-chat-hf"  # Replace with the path to your LLaMA model
print("Loading model...")
device = "cuda" if torch.cuda.is_available() else "cpu" #THIS WILL RUN BADLY ON LAPTOPS BEWARE
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, device_map="auto", torch_dtype=torch.float16)
print("Model loaded successfully!")

# Define endpoint for generating responses
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Tokenize input and generate response
        input_ids = tokenizer.encode(user_message, return_tensors="pt").to(device)
        output = model.generate(
            input_ids,
            max_length=512,
            temperature=0.7,  # Adjust for more/less randomness
            top_p=0.9,
            num_return_sequences=1
        )
        bot_reply = tokenizer.decode(output[0], skip_special_tokens=True)

        return jsonify({"reply": bot_reply})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing your request"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)