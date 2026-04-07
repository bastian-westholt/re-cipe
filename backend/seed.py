from dotenv import load_dotenv
load_dotenv()
import json
from app import app
from models import db, User, Recipe, Ingredient, Step, Favorite, RelatedRecipe
import ai_service
from storage_service import upload_image_to_cloud

with app.app_context():
    db.session.query(Favorite).delete()
    db.session.query(RelatedRecipe).delete()
    db.session.query(Step).delete()
    db.session.query(Ingredient).delete()
    db.session.query(Recipe).delete()
    db.session.query(User).delete()

    master_user = User(
        username="admin",
        email="admin@mail.com",
        password_hash="master-user-v1",
        role="admin"
    )

    db.session.add(master_user)
    db.session.flush()

    with open('data/seed_data.json', 'r', encoding='utf-8') as file_obj:
        seed_data = json.load(file_obj)

    for data in seed_data:
        data['recipe']['user_id'] = master_user.id
        data['recipe']['embedding'] = ai_service.generate_embedding(f"{data['recipe']['title_en']}, {data['recipe']['description_en']}")
        data['recipe']['image_url'] = None
        recipe = Recipe(**data['recipe'])
        db.session.add(recipe)
        db.session.flush()

        import time
        time.sleep(15)
        image_bytes = ai_service.generate_image(data['recipe']['title_en'], data['recipe']['description_en'])
        if image_bytes:
            url = upload_image_to_cloud(image_bytes)
            if url:
                recipe.image_url = url
                print(f"Bild generiert: {data['recipe']['title_en']}")

        for ing in data['ingredients']:
            ingredient = Ingredient(**ing, recipe_id=recipe.id)
            db.session.add(ingredient)
            db.session.flush()

        for stp in data['steps']:
            step = Step(**stp, recipe_id=recipe.id)
            db.session.add(step)
            db.session.flush()

    db.session.commit()
    print(f'Seed erfolgreich: {len(seed_data)} Rezepte angelegt.')


'''i
    # 2. Seed Data laden
    with open("seed_data.json", "r", encoding="utf-8") as f:
        seed_data = json.load(f)

    # 3. Rezepte, Ingredients und Steps erstellen
    for data in seed_data:
        recipe = Recipe(**data["recipe"])
        db.session.add(recipe)
        db.session.flush()

        for ing in data["ingredients"]:
            ingredient = Ingredient(**ing, recipe_id=recipe.id)
            db.session.add(ingredient)

        for step in data["steps"]:
            step_obj = Step(**step, recipe_id=recipe.id)
            db.session.add(step_obj)

    db.session.commit()
    print(f"Seed erfolgreich: {len(seed_data)} Rezepte angelegt.")
'''