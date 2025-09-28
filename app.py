import os
import json
from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai
import re
import numpy as np
import tensorflow as tf
from tensorflow.keras.utils import load_img, img_to_array


CLASS_NAMES = [
    'aerosol_cans', 'aluminum_food_cans', 'aluminum_soda_cans', 'cardboard_boxes', 
    'cardboard_packaging', 'clothing', 'coffee_grounds', 'disposable_plastic_cutlery', 
    'eggshells', 'food_waste', 'glass_beverage_bottles', 'glass_cosmetic_containers', 
    'glass_food_jars', 'magazines', 'newspaper', 'office_paper', 'paper_cups', 
    'plastic_cup_lids', 'plastic_detergent_bottles', 'plastic_food_containers', 
    'plastic_shopping_bags', 'plastic_soda_bottles', 'plastic_straws', 
    'plastic_trash_bags', 'plastic_water_bottles', 'shoes', 'steel_food_cans', 
    'styrofoam_cups', 'styrofoam_food_containers', 'tea_bags'
]


IMG_HEIGHT = 224 
IMG_WIDTH = 224

def predict_class(model_path, image_path, class_names, img_height, img_width):
    """
    Loads an ML model, preprocesses an image, makes a prediction,
    and maps the result to a class name.
    """
    try:
        # Load the saved Keras model
        print(f"Loading model from: {model_path}...")
        model = tf.keras.models.load_model(model_path) 
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        return "ERROR: Could not load model."
    
    try:
        # Load the image and resize it (CORRECTED: using load_img directly)
        img = load_img(image_path, target_size=(img_height, img_width))
        
        # Convert the image to a NumPy array (CORRECTED: using img_to_array directly)
        img_array = img_to_array(img)
        
        # Expand dimensions to create a batch (1, H, W, C)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Normalize the image data 
        img_array = img_array / 255.0 

    except Exception as e:
        print(f"Error loading or preprocessing image: {e}")
        return "ERROR: Could not load/preprocess image."

    # Make the prediction
    print("Making prediction...")
    predictions = model.predict(img_array)
    
    # Get the index of the class with the highest probability
    predicted_class_index = np.argmax(predictions[0])
    
    predicted_class_name = class_names[predicted_class_index]
    
    return predicted_class_name


app = Flask(__name__)
genai.configure(api_key="AIzaSyDbFQMGPn4dWbhQa2R85gxB4Jb9vFoppDQ")

model = genai.GenerativeModel("models/gemini-2.5-flash-image-preview")

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Add CORS support for development
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        MODEL_PATH = 'material_detection.h5' # Your ML model path

        file = request.files['image']
        temp_path = os.path.join("temp_upload", file.filename)
        os.makedirs("temp_upload", exist_ok=True)
        file.save(temp_path)

        # 1. RUN ML MODEL PREDICTION
        predicted_class_name = predict_class(MODEL_PATH, temp_path, CLASS_NAMES, IMG_HEIGHT, IMG_WIDTH)

        # Handle prediction errors
        if predicted_class_name.startswith("ERROR"):
            os.remove(temp_path)
            return jsonify({"error": f"ML Model Prediction Error: {predicted_class_name}"}), 500

        print(f"ML Model Predicted Class: {predicted_class_name}")

        uploaded_file = genai.upload_file(temp_path)

        # 2. CONSTRUCT GEMINI PROMPT WITH PREDICTED CLASS
        prompt = f"""
    Analyze the image provided, which our internal ML model identified as a **{predicted_class_name}**.
    Based on this identified object, return a JSON object with the following keys:

    - object_name: the name of the primary object in the image, strictly use: **{predicted_class_name}**.
    - material: the most likely material of the object, chosen from this list:
- Plastic: water bottles, soda bottles, detergent bottles, shopping bags, trash bags, food containers, disposable cutlery, straws, cup lids
- Paper and Cardboard: newspaper, office paper, magazines, cardboard boxes, cardboard packaging
- Glass: beverage bottles, food jars, cosmetic containers
- Metal: aluminum soda cans, aluminum food cans, steel food cans, aerosol cans
- Organic Waste: food waste (fruit peels, vegetable scraps), eggshells, coffee grounds, tea bags
- Textiles: clothing, shoes, linens, upholstery, fabric scraps
- E-Waste: old phones, batteries, chargers, cables, small electronics

    - estimated_weight_g: a reasonable estimation of the object's weight in grams.
    - carbonFootprint: estimated carbon emissions in grams CO₂e for the object and the estimated weight.
    - altName: sustainable alternative materials and products, specify the material name as well.

    Return ONLY the JSON object. Do NOT include markdown formatting, explanation, or commentary.
    """

        response = model.generate_content([
            prompt,
            uploaded_file
        ])
            
        # ✅ Remove Markdown formatting like ```json ... ```
        raw_text = response.text.strip()
        cleaned_text = re.sub(r"^```json|```$", "", raw_text).strip()

        parsed = json.loads(cleaned_text)
        
        # 3. CLEAN UP
        os.remove(temp_path)
        # Note: uploaded_file should also be deleted using genai.delete_file(uploaded_file.name)
        # in a production environment to free up API storage.

        return jsonify(parsed)

    except json.JSONDecodeError:
        return jsonify({"error": "Gemini response was not valid JSON", "raw": response.text}), 500
    except Exception as e:
        # Ensure temp file is cleaned up even on general exception
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # NOTE: In a real environment, you should pre-load the Keras model outside 
    # the Flask route to prevent it from reloading on every single request.
    app.run(debug=True)
