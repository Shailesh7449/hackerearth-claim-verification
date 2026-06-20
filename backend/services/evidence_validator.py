import pandas as pd

def validate_evidence(object_type: str, num_images: int, evidence_req_df: pd.DataFrame) -> tuple[bool, str]:
    """
    Validates the provided evidence against the evidence_requirements.
    Returns (is_met, reason_string)
    """
    if evidence_req_df is None or evidence_req_df.empty:
        # Default behavior if dataset missing
        if num_images > 0:
            return True, f"{num_images} images provided"
        return False, "No images provided"
        
    reqs = evidence_req_df[evidence_req_df['object_type'] == object_type]
    
    if reqs.empty:
        # Fallback if object type not in requirements
        return True, "No specific requirements for this object type"
        
    min_images = int(reqs.iloc[0]['min_images'])
    
    if num_images >= min_images:
        return True, f"Standard met: {num_images} images provided (minimum {min_images} required)"
    else:
        return False, f"Standard not met: Only {num_images} images provided (minimum {min_images} required)"
