from pydantic import BaseModel
import requests
from openai import OpenAI
from dotenv import load_dotenv
import urllib.parse
from storage_service import upload_image_to_cloud
import os

SYSTEM_PROMPT = """
Du bist ein mit einem Michelinstern ausgezeichneter Spitzenkoch und Rezeptentwickler.

Gib ausschließlich valides JSON aus, ohne zusätzlichen Text und ohne Markdown.

Das JSON MUSS exakt diesem Schema entsprechen (keine Extra-Felder):
{
  "title": string,
  "description": string,
  "prep_time": int,
  "cook_time": int,
  "servings": int,
  "difficulty": "easy" | "medium" | "hard",
  "ingredients": [
    {"name": string, "amount": float, "unit": string, "position": int}
  ],
  "steps": [
    {"step_number": int, "instruction": string}
  ]
}

Regeln:
- Integriere aus JEDEM Ursprungsrezept mindestens 1 klar erkennbares Element (Zutat/Technik/Aromatik/Textur).
- Mengen: amount muss eine Zahl sein (z. B. 0.5, 2, 12.0). Keine Brüche als Text.
- Für „nach Geschmack” setze amount=0 und unit=”n. G.”.
- Zeiten in Minuten als ganze Zahl.
- title: maximal 80 Zeichen, kein Untertitel oder Subtitel, nur der Rezeptname.
- Sprache: Deutsch.
"""

OLD_SYSTEM_PROMPT = '''"Du bist ein Spitzenkoch ausgezeichnet mit einem Michelinstern und viel Raffinesse. Du erhältst 2-5 traditionelle Rezepte als Inspiration. Erstelle daraus EIN neues, kreatives Fusion-Rezept, das einige Elemente aus allen gegebenen Rezepten kombiniert und neukomponiert oder sogar leicht abgewandelt um den bestmöglichen Geschmack zu ermöglichen. Das Ergebnis muss realistisch kochbar sein, des weiteren muss das Rezept kohärent sein. Es gibt nur die Schwierigkeitsgrade ('hard', 'medium', 'easy'). Antworte auf Deutsch."'''

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

def generate_embedding(query):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=f"{query}"
    )
    embedding = response.data[0].embedding

    return embedding

def generate_image(title, description):
    image_prompt = f'{title}, {description}: Create food photography of given recipe, professional lighting, top-down view'
    encoded_prompt = urllib.parse.quote(image_prompt)

    response = requests.get(
        f'https://gen.pollinations.ai/image/{encoded_prompt}',
        params={
            "model": "imagen-4",
            "width": "1024",
            "height": "1024",
            "enhance": "true"
        },
        headers={
            "Authorization": f"Bearer {os.getenv('POLLINATIONS_API_KEY')}"
        }
    )

    print(response.status_code)
    print(response.content[:200])

    return response.content

def generate_fusion(originals):
    original_str = "\n\n".join(build_prompt(originals))

    response = client.responses.parse(
        model="gpt-5.2-2025-12-11",
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": original_str}
        ],
        text_format=FusionRecipe,
    )

    data = response.output_parsed
    obj = data.model_dump()
    image = generate_image(obj["title"], obj["description"])
    obj["image_url"] = upload_image_to_cloud(image)

    return obj
