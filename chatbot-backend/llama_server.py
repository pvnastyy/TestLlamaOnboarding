from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
from PIL import Image
import pytesseract
import torch
import os


app = Flask(__name__)
CORS(app)

#Load LLaMA model
#"C:\Users\Admin\Downloads\llama-2-7b-chat.Q5_K_M.gguf"
MODEL_PATH = "/mnt/c/Users/Admin/Downloads/llama-2-7b-chat.Q5_K_M.gguf"  # Replace with your path, this is mine
print("Loading LLaMA model...")
device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(MODEL_PATH, device_map="auto", torch_dtype=torch.float16)
print("Model loaded successfully!")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        input_ids = tokenizer.encode(user_message, return_tensors="pt").to(device)
        output = model.generate(input_ids, max_length=512, temperature=0.7, top_p=0.9)
        bot_reply = tokenizer.decode(output[0], skip_special_tokens=True)
        return jsonify({"reply": bot_reply})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred"}), 500

#photo input
@app.route('/photo-chat', methods=['POST'])
def photo_chat():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        
        temp_path = os.path.join("uploads", file.filename)
        file.save(temp_path)
        image = Image.open(temp_path)
        extracted_text = pytesseract.image_to_string(image)

        input_ids = tokenizer.encode(extracted_text, return_tensors="pt").to(device)
        output = model.generate(input_ids, max_length=512, temperature=0.7, top_p=0.9)
        bot_reply = tokenizer.decode(output[0], skip_special_tokens=True)

        os.remove(temp_path) 
        return jsonify({"reply": bot_reply, "extracted_text": extracted_text})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred"}), 500


if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    app.run(host="0.0.0.0", port=5000)
