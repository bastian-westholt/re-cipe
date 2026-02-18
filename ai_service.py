from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
GPT_KEY = os.getenv('GPT_API_KEY')
if not GPT_KEY:
    raise EnvironmentError("No 'GPT_API_KEY' in .env found")

client = OpenAI(api_key=GPT_KEY)

class FusionIngredient(BaseModel):
    name: str
    amount: float
    unit: str
    position: int

class FusionStep(BaseModel):
    step_number: int
    instruction: str

class FusionRecipe(BaseModel):
    title: str
    description: str
    prep_time: int
    cook_time: int
    servings: int
    difficulty: str
    ingredients: list[FusionIngredient]
    steps: list[FusionStep]

def build_prompt(originals):
    recipe_texts = []

    for og in originals:
        ings = []
        for ing in og.ingredients:
            ings.append(f"{ing.amount} {ing.unit} {ing.name}")

        stps = []
        for stp in og.steps:
            stps.append(f"{stp.step_number}. {stp.instruction}")

        recipe_texts.append(f'Rezept: {og.title}: {og.description} - Ingredients: {ings} - Steps: {stps}')

    return recipe_texts

def generate_fusion(originals):
    original_str = "\n\n".join(build_prompt(originals))

    response = client.responses.parse(
        model="gpt-4o-2024-08-06",
        input=[
            {"role": "system", "content": "Du bist ein kreativer Fusion-Koch. Du erhältst 2-5 traditionelle Rezepte als Inspiration. Erstelle daraus EIN neues, kreatives Fusion-Rezept, das Elemente aus allen gegebenen Rezepten kombiniert. Das Ergebnis muss realistisch kochbar sein. Antworte auf Deutsch."},
            {"role": "user", "content": original_str}
        ],
        text_format=FusionRecipe,
    )

    data = response.output_parsed
    obj = data.model_dump()

    return obj