import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
import json

class ImageAnalysisResult(BaseModel):
    object_type: str = Field(description="The primary object in the image (e.g., car, laptop, package)")
    visible_damage: str = Field(description="Description of the damage visible in the image")
    damaged_part: str = Field(description="The specific part of the object that is damaged")
    severity: str = Field(description="Severity of the damage (low, medium, high)")
    image_quality: str = Field(description="Quality of the image (poor, adequate, good)")
    confidence_score: int = Field(description="Confidence score in the analysis out of 100")
    is_valid_evidence: bool = Field(description="Whether the image actually contains the expected object and damage")

def analyze_image(image_path: str, object_context: str) -> ImageAnalysisResult:
    """
    Calls Gemini 2.5 Flash Vision to analyze the damage image.
    Uses structured output (JSON schema).
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        # Fallback mock for testing without API key
        return ImageAnalysisResult(
            object_type=object_context,
            visible_damage="Detected damage based on simulation.",
            damaged_part="display",
            severity="high",
            image_quality="good",
            confidence_score=90,
            is_valid_evidence=True
        )

    try:
        client = genai.Client(api_key=api_key)
        
        # We would typically upload the file or pass raw bytes.
        # For hackathon/simplicity, assuming we pass a local path to upload_file
        # or use raw bytes. Since Google GenAI python SDK v2.8+ is used:
        uploaded_file = client.files.upload(file=image_path)
        
        prompt = f"Analyze this image of a {object_context}. Identify the object type, visible damage, the specific damaged part, severity of damage, and image quality."
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[uploaded_file, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ImageAnalysisResult,
                temperature=0.1
            ),
        )
        
        # Clean up the file to avoid quota issues
        client.files.delete(name=uploaded_file.name)
        
        # Parse result
        result_dict = json.loads(response.text)
        return ImageAnalysisResult(**result_dict)
        
    except Exception as e:
        print(f"Error in Gemini Vision API: {e}")
        # Return fallback on error to not crash the pipeline
        return ImageAnalysisResult(
            object_type=object_context,
            visible_damage="Error during analysis.",
            damaged_part="unknown",
            severity="unknown",
            image_quality="poor",
            confidence_score=0,
            is_valid_evidence=False
        )
