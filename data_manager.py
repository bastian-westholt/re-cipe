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

    def get_ings_and_stps_for_recipe(self, recipe):

        recipe.ingredients = db.session.execute(
            select(Ingredient).where(Ingredient.recipe_id == recipe.id).order_by(Ingredient.position)
        ).scalars().all()

        recipe.steps = db.session.execute(
            select(Step).where(Step.recipe_id == recipe.id).order_by(Step.step_number)
        ).scalars().all()

        return recipe

    def get_recipe_by_id(self, recipe_id):

        recipe = db.session.execute(
            select(Recipe).where(Recipe.id == recipe_id)
        ).scalar()

        recipe = self.get_ings_and_stps_for_recipe(recipe)

        return recipe

    def get_multiple_recipes_by_id(self, recipe_ids):

        recipes = db.session.execute(
            select(Recipe).where(Recipe.id.in_(recipe_ids))
        ).scalars().all()

        for recipe in recipes:
            self.get_ings_and_stps_for_recipe(recipe)

        return recipes

    def get_master_user(self):
        return db.session.execute(select(User).where(User.role == "admin")).scalar()

    def save_fusion(self, obj):
        ingredients = obj.pop("ingredients")
        steps = obj.pop("steps")
        master_user = self.get_master_user()

        fusion = Recipe(**obj, type="fusion", user_id=master_user.id)
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
        return self.get_ings_and_stps_for_recipe(fusion)