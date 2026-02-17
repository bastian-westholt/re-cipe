import json
from app import app
from models import db, User, Recipe, Ingredient, Step, Favorite, RelatedRecipe

with app.app_context():
    db.session.query(Step).delete()
    db.session.query(Ingredient).delete()
    db.session.query(Recipe).delete()
    db.session.query(User).delete()
    db.session.query(Favorite).delete()
    db.session.query(RelatedRecipe).delete()

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
        recipe = Recipe(**data['recipe'])
        db.session.add(recipe)
        db.session.flush()

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