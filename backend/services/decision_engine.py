from services.image_analyzer import ImageAnalysisResult
from services.claim_parser import ParsedClaim

def decide_claim_status(
    parsed_claim: ParsedClaim, 
    image_result: ImageAnalysisResult, 
    evidence_valid: bool
) -> tuple[str, str]:
    """
    Determines final claim status based on rules.
    Returns (status, justification)
    Status must be one of: supported, contradicted, not_enough_information
    """
    if not evidence_valid:
        return "not_enough_information", "Required evidence standard was not met."
        
    if image_result.image_quality.lower() == "poor" or image_result.confidence_score < 40:
        return "not_enough_information", "Image quality is too poor or confidence is too low to make a determination."
        
    # Check for contradictions
    if not image_result.is_valid_evidence:
        return "contradicted", "The uploaded images do not depict the claimed object or damage."
        
    # We can do a simple string match or semantic match for object type
    # For hackathon logic:
    obj_match = parsed_claim.object_type.lower() in image_result.object_type.lower() or image_result.object_type.lower() in parsed_claim.object_type.lower()
    
    if not obj_match and image_result.object_type != "unknown":
        return "contradicted", f"Claimed object '{parsed_claim.object_type}' does not match visual evidence '{image_result.object_type}'."
        
    # Support claim
    return "supported", "Visible damage and object match the claim description."
