import os
import json
from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai
import re

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
        file = request.files['image']
        temp_path = os.path.join("temp_upload", file.filename)
        os.makedirs("temp_upload", exist_ok=True)
        file.save(temp_path)

        uploaded_file = genai.upload_file(temp_path)

        response = model.generate_content([
        """
    Analyze the image provided and return a JSON object with the following keys:

    - object_name: the name of the primary object in the image.
    - material: the most likely material of the object, chosen from this list:
- Plastic: water bottles, soda bottles, detergent bottles, shopping bags, trash bags, food containers, disposable cutlery, straws, cup lids
- Paper and Cardboard: newspaper, office paper, magazines, cardboard boxes, cardboard packaging
- Glass: beverage bottles, food jars, cosmetic containers
- Metal: aluminum soda cans, aluminum food cans, steel food cans, aerosol cans
- Organic Waste: food waste (fruit peels, vegetable scraps), eggshells, coffee grounds, tea bags
- Textiles: clothing, shoes, linens, upholstery, fabric scraps
- E-Waste: old phones, batteries, chargers, cables, small electronics

    - estimated_weight_g: a reasonable estimation of the object's weight in grams.
    - carbonFootprint: estimated carbon emissions in grams CO₂e for the object.
    - altName: a sustainable alternative material or product, specify the material name as well.

    Return ONLY the JSON object. Do NOT include markdown formatting, explanation, or commentary.
    """,
        uploaded_file
    ])
            

        # ✅ Remove Markdown formatting like ```json ... ```
        raw_text = response.text.strip()
        cleaned_text = re.sub(r"^```json|```$", "", raw_text).strip()

        parsed = json.loads(cleaned_text)
        os.remove(temp_path)

        return jsonify(parsed)

    except json.JSONDecodeError:
        return jsonify({"error": "Gemini response was not valid JSON", "raw": response.text}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
