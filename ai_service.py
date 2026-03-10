from pydantic import BaseModel
import requests
from openai import OpenAI
from dotenv import load_dotenv
import urllib.parse
from storage_service import upload_image_to_cloud
import os
import logging

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
- description: maximal 200 Zeichen, orientiere dich an der Kürze der Originalrezept-Beschreibungen.
"""

FEEDBACK_PROMPT = """
Du bist ein mit einem Michelinstern ausgezeichneter Spitzenkoch und Rezeptentwickler.

Du hast bereits ein Fusion-Rezept erstellt das in der Konversationshistorie zu finden ist.
Überarbeite es gezielt basierend auf dem Feedback des Users - behalte was gut ist und passe nur
an was kritisiert wurde.

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
- Integriere aus JEDEM Ursprungsrezept mindestens 1 klar erkennbares Element
(Zutat/Technik/Aromatik/Textur).
- Mengen: amount muss eine Zahl sein (z. B. 0.5, 2, 12.0). Keine Brüche als Text.
- Für „nach Geschmack" setze amount=0 und unit="n. G.".
- Zeiten in Minuten als ganze Zahl.
- title: maximal 80 Zeichen, kein Untertitel oder Subtitel, nur der Rezeptname.
- Sprache: Deutsch.
- description: maximal 200 Zeichen, orientiere dich an der Kürze der Originalrezept-Beschreibungen.
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
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=f"{query}"
        )
        embedding = response.data[0].embedding
        if not embedding:
            return None

        return embedding
    except Exception as e:
        logging.error(f'Embedding Error: {e}')
        return None

def generate_image(title, description):
    try:
        image_prompt = f'{title}, {description}: Create food photography of given recipe, professional lighting, top-down view'
        encoded_prompt = urllib.parse.quote(image_prompt)

        response = requests.get(
            f'https://gen.pollinations.ai/image/{encoded_prompt}',
            params={
                "model": "gptimage",
                "width": "1024",
                "height": "1024",
                "enhance": "true"
            },
            headers={
                "Authorization": f"Bearer {os.getenv('POLLINATIONS_API_KEY')}"
            },
            timeout=(5, 60)
        )

        if response.status_code != 200:
            logging.warning(f"Pollinations Fehler: {response.status_code}")
            return None
        return response.content
    except requests.exceptions.Timeout:
        return None

def generate_fusion(recipes, messages):
    try:
        recipes_str = "\n\n".join(build_prompt(recipes))

        response = client.responses.parse(
            model="gpt-5.2-2025-12-11",
            input=[
                {"role": "system", "content": SYSTEM_PROMPT if not messages else FEEDBACK_PROMPT},
                {"role": "user", "content": recipes_str},
                *messages
            ],
            text_format=FusionRecipe,
        )

        data = response.output_parsed
        if not data:
            return None
        obj = data.model_dump()

        return obj
    except Exception as e:
        logging.error(f"GPT Fehler: {e}")
        return None

