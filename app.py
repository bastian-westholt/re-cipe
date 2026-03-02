import os
import logging
from flask import Flask, render_template, redirect, request, url_for, jsonify
from flask_cors import CORS
import ai_service
from models import db
from data_manager import DataManager
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

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

@app.route('/recipes/fusion', methods=['POST'])
def create_fusion():
    data = request.get_json()
    recipe_ids = data['recipe_ids']
    recipes = data_manager.get_multiple_recipes_by_id(recipe_ids)
    if not recipes:
        return jsonify({"error": "Rezepte nicht gefunden"}), 404
    fusionObj = ai_service.generate_fusion(recipes)
    if not fusionObj:
        return jsonify({"error": "Fusion nicht gefunden"}), 404
    fusion = data_manager.save_fusion(fusionObj)
    return jsonify(fusion.to_dict())

if __name__ == '__main__':
    # with app.app_context():
        # db.create_all()
        # print(f' * Datenbank initialisiert.')
    app.run('0.0.0.0', 5001, debug=True)
