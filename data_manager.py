from sqlalchemy import select
from models import db, User, Recipe, Ingredient, Step


class DataManager:

    def get_all_recipes(self):

        recipes = db.session.execute(
            select(Recipe).order_by(Recipe.title)
        ).scalars().all()

        for recipe in recipes:
            recipe.ingredients = db.session.execute(
                select(Ingredient).where(Ingredient.recipe_id == recipe.id).order_by(Ingredient.position)
            ).scalars().all()

            recipe.steps = db.session.execute(
                select(Step).where(Step.recipe_id == recipe.id).order_by(Step.step_number)
            ).scalars().all()

        return recipes

    def get_recipe_by_id(self, recipe_id):

        recipe_by_id_query = (
            select(Recipe)
            .where(recipe_id == Recipe.id)
        )

        list_of_recipe_by_id = db.session.execute(recipe_by_id_query).scalar()
        return list_of_recipe_by_id

    def get_multiple_recipes_by_id(self, recipe_ids):

        recipes = db.session.execute(
            select(Recipe).where(Recipe.id.in_(recipe_ids))
        ).scalars().all()

        for recipe in recipes:
            recipe.ingredients = db.session.execute(
                select(Ingredient).where(Ingredient.recipe_id == recipe.id).order_by(Ingredient.position)
            ).scalars().all()

            recipe.steps = db.session.execute(
                select(Step).where(Step.recipe_id == recipe.id).order_by(Step.step_number)
            ).scalars().all()

        return recipes

    def save_fusion(self, obj):
        ingredients = obj.pop("ingredients")
        steps = obj.pop("steps")

        fusion = Recipe(**obj, type="fusion", user_id=1)
        db.session.add(fusion)
        db.session.flush()

        for ing in ingredients:
            ingredient = Ingredient(**ing, recipe_id=fusion.id)
            db.session.add(ingredient)
            db.session.flush()

        for stp in steps:
            step = Step(**stp, recipe_id=fusion.id)
            db.session.add(step)
            db.session.flush()

        db.session.commit()
        return obj