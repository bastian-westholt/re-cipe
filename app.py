import os
import logging
import json
from flask import Flask, render_template, redirect, request, url_for, jsonify
from flask_cors import CORS
import ai_service
import storage_service
from models import db
from data_manager import DataManager
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, origins='*')

logging.basicConfig(
      level=logging.DEBUG,
      format='%(asctime)s - %(levelname)s - %(message)s'
  )

load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.sort_keys = False
app.json.ensure_ascii = False

db.init_app(app)
data_manager = DataManager()

@app.route('/')
def hello_world():  # put application's code here
    return 'Willkommen zur API von Re:cipe'

@app.route('/recipes')
def list_all_recipes():
    query = request.args.get('q')
    page = request.args.get('page', 0, type=int)
    if query:
        recipes = data_manager.get_recipes_by_query(query, page)
        return jsonify([recipe.to_dict() for recipe in recipes])
    else:
        recipes = data_manager.get_all_recipes()
        return jsonify([recipe.to_dict() for recipe in recipes])

@app.route('/recipes/<int:recipe_id>')
def get_recipe_by_id(recipe_id):
    recipe = data_manager.get_recipe_by_id(recipe_id)
    if not recipe:
        return jsonify({"error": "Rezept nicht gefunden"}), 404
    return jsonify(recipe.to_dict())

@app.route('/recipes/fusion/create', methods=['POST'])
def create_fusion():
    data = request.get_json()
    recipe_ids = data['recipe_ids']
    previous_fusion = data.get("previous_fusion")
    feedback = data.get("feedback")

    messages = []
    if previous_fusion and feedback:
        messages = [
            {"role": "assistant", "content": json.dumps(previous_fusion, ensure_ascii=False)},
            {"role": "user", "content": feedback}
        ]

    recipes = data_manager.get_multiple_recipes_by_id(recipe_ids)
    if not recipes:
        return jsonify({"error": "Rezepte nicht gefunden"}), 404

    fusionObj = ai_service.generate_fusion(recipes, messages)
    if not fusionObj:
        return jsonify({"error": "Fusion nicht gefunden"}), 404

    if not messages:
        image = ai_service.generate_image(fusionObj["title_en"], fusionObj["description_en"])
        fusionObj["image_url"] = storage_service.upload_image_to_cloud(image) if image else None

    return jsonify(fusionObj)

@app.route('/recipes/fusion/save', methods=['POST'])
def save_fusion():
    data = request.get_json()
    fusion = data_manager.save_fusion(data)
    return jsonify(fusion.to_dict())

if __name__ == '__main__':
    # with app.app_context():
        # db.create_all()
        # print(f' * Datenbank initialisiert.')
    app.run('0.0.0.0', 5001, debug=True)
