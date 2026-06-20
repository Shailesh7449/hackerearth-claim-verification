from models.schemas import OutputSchema
from services.image_analyzer import ImageAnalysisResult

def generate_output(
    evidence_valid: bool,
    evidence_reason: str,
    risk_flags: str,
    parsed_issue_type: str,
    parsed_object_part: str,
    claim_status: str,
    claim_justification: str,
    supporting_image_ids: list[str],
    image_result: ImageAnalysisResult
) -> dict:
    """
    Formats the final output to strictly match the requested CSV schema.
    """
    output = OutputSchema(
        evidence_standard_met=str(evidence_valid).lower(),
        evidence_standard_met_reason=evidence_reason,
        risk_flags=risk_flags,
        issue_type=parsed_issue_type,
        object_part=parsed_object_part,
        claim_status=claim_status,
        claim_status_justification=claim_justification,
        supporting_image_ids=",".join(supporting_image_ids),
        valid_image=str(image_result.is_valid_evidence).lower(),
        severity=image_result.severity
    )
    
    return output.model_dump()
