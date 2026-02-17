from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    password_hash = db.Column(db.String(127), nullable=False)
    role = db.Column(db.String(20), default='user', nullable=False)
    bio = db.Column(db.String(150), nullable=True)
    avatar_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, onupdate=db.func.now(), nullable=True)

    def __repr__(self):
        """Developer-friendly string representation."""
        return f'User(id: {self.id}, name: {self.username})'

    def __str__(self):
        """User-friendly string representation."""
        return self.username

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

class Recipe(db.Model):

    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(10), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    origin_country = db.Column(db.String(100), nullable=True)
    origin_region = db.Column(db.String(100), nullable=True)
    creator_note = db.Column(db.Text, nullable=True)
    prep_time = db.Column(db.Integer, nullable=False)
    cook_time = db.Column(db.Integer, nullable=False)
    servings = db.Column(db.Integer, default=4, nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    favorite_count = db.Column(db.Integer, default=0, nullable=False)
    is_draft = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, onupdate=db.func.now(), nullable=True)

    def __repr__(self):
        return f'Recipe(id: "{self.id}", title: "{self.title}")'

    def __str__(self):
        return self.title

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "image_url": self.image_url,
            "origin_country": self.origin_country,
            "origin_region": self.origin_region,
            "creator_note": self.creator_note,
            "prep_time": self.prep_time,
            "cook_time": self.cook_time,
            "servings": self.servings,
            "difficulty": self.difficulty,
            "favorite_count": self.favorite_count,
            "is_draft": self.is_draft,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class RelatedRecipe(db.Model):

    __tablename__ = 'related_recipes'
    __table_args__ = (db.UniqueConstraint('fusion_id', 'original_id'),)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    original_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    fusion_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    position = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'RelatedRecipe(id: "{self.id}", original_id: "{self.original_id}", fusion_id: "{self.fusion_id}")'


    def __str__(self):
        return f'{self.fusion_id} -> {self.original_id}'


    def to_dict(self):
        return {
            "id": self.id,
            "original_id": self.original_id,
            "fusion_id": self.fusion_id,
            "position": self.position
        }

class Favorite(db.Model):

    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)

    def __repr__(self):
        return f'Favorite(id: "{self.id}", recipe_id: "{self.recipe_id}")'

    def __str__(self):
        return f'{self.recipe_id}'

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "recipe_id": self.recipe_id,
            "created_at": self.created_at
        }

class Ingredient(db.Model):

    __tablename__ = 'ingredients'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=True)
    unit = db.Column(db.String(50), nullable=True)
    position = db.Column(db.Integer, nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)

    def __repr__(self):
        return f'Ingredient(id: "{self.id}", name: "{self.name}")'

    def __str__(self):
        return self.name

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "unit": self.unit,
            "position": self.position,
            "recipe_id": self.recipe_id
        }

class Step(db.Model):

    __tablename__ = 'steps'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_url = db.Column(db.String(255), nullable=True)
    step_number = db.Column(db.Integer, nullable=False)
    instruction = db.Column(db.Text, nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)

    def __repr__(self):
        return f'Step(id: "{self.id}", step_number: "{self.step_number}")'

    def __str__(self):
        return f'{self.step_number}'

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "step_number": self.step_number,
            "instruction": self.instruction,
            "recipe_id": self.recipe_id
        }

