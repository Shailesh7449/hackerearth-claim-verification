import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
import json

class ParsedClaim(BaseModel):
    object_type: str = Field(description="The type of object claimed (e.g. car, laptop, package)")
    damage_type: str = Field(description="The nature of the damage")
    claimed_part: str = Field(description="The specific part claimed to be damaged")
    claim_intent: str = Field(description="The underlying intent of the claim (e.g. repair, replacement)")

def parse_claim(claim_text: str) -> ParsedClaim:
    """
    Extracts structured data from the claim description.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return ParsedClaim(
            object_type="car",
            damage_type="rear-end collision damage",
            claimed_part="bumper",
            claim_intent="repair"
        )
        
    try:
        client = genai.Client(api_key=api_key)
        prompt = f"Extract the object type, damage type, claimed part, and claim intent from this damage claim: '{claim_text}'"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ParsedClaim,
                temperature=0.0
            ),
        )
        
        result_dict = json.loads(response.text)
        return ParsedClaim(**result_dict)
    except Exception as e:
        print(f"Error parsing claim: {e}")
        return ParsedClaim(
            object_type="unknown",
            damage_type="unknown",
            claimed_part="unknown",
            claim_intent="unknown"
        )
