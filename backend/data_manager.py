from sqlalchemy import select
import logging
import ai_service
import storage_service
from models import db, User, Recipe, Ingredient, Step, RelatedRecipe, Theme


class DataManager:

    def get_all_recipes(self):

        recipes = db.session.execute(
            select(Recipe).order_by(Recipe.title_en)
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

    def get_recipes_by_query(self, query, page):
        query_embedding = ai_service.generate_embedding(query)
        recipes = db.session.execute(
            select(Recipe).order_by(Recipe.embedding.cosine_distance(query_embedding)).limit(10).offset(page * 10)
        ).scalars().all()
        return recipes

    def get_recipes_by_embedding(self, title, page):

        slug = title.lower().replace(' ', '-')
        theme_found = db.session.execute(
            select(Theme).where(Theme.slug == slug)
        ).scalar()

        if theme_found:
            themed_recipes = db.session.execute(
                select(Recipe).order_by(Recipe.embedding.cosine_distance(theme_found.embedding)).limit(9).offset(page * 9)
            ).scalars().all()
            return themed_recipes
        else:
            theme_embedding = ai_service.generate_embedding(title)
            if not theme_embedding:
                return []
            theme = Theme(slug=slug, title=title, embedding=theme_embedding)
            db.session.add(theme)
            db.session.commit()
            themed_recipes = db.session.execute(
                select(Recipe).order_by(Recipe.embedding.cosine_distance(theme.embedding)).limit(3).offset(
                    page * 3)
            ).scalars().all()
            return themed_recipes

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

    def get_related_recipes_by_id(self, recipe_id):
        related_recipes = db.session.execute(
            select(Recipe)
                .join(RelatedRecipe, RelatedRecipe.original_id == Recipe.id)
                .where(RelatedRecipe.fusion_id == recipe_id)
                .order_by(RelatedRecipe.position)
        ).scalars().all()

        return related_recipes

    def get_master_user(self):
        return db.session.execute(select(User).where(User.role == "admin")).scalar()

    def save_fusion(self, obj):
        ingredients = obj.pop("ingredients")
        steps = obj.pop("steps")
        recipe_ids = obj.pop("recipe_ids")
        if not obj.get('image_url'):
            image = ai_service.generate_image(obj["title_en"], obj["description_en"])
            obj["image_url"] = storage_service.upload_image_to_cloud(image) if image else None
        obj['embedding'] = ai_service.generate_embedding(f'{obj["title_en"]}, {obj["description_en"]}')
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

        for position, original_id in enumerate(recipe_ids, start=1):
            related = RelatedRecipe(fusion_id=fusion.id, original_id=original_id, position=position)
            db.session.add(related)

        db.session.commit()
        logging.info(f"Fusion gespeichert: {fusion.id}")
        return self.get_ings_and_stps_for_recipe(fusion)