from pydantic import BaseModel
from typing import List, Optional

class OutputSchema(BaseModel):
    evidence_standard_met: str
    evidence_standard_met_reason: str
    risk_flags: str
    issue_type: str
    object_part: str
    claim_status: str
    claim_status_justification: str
    supporting_image_ids: str
    valid_image: str
    severity: str

class VerifyRequest(BaseModel):
    claim_id: str
    claim_text: str
    user_id: str
    image_ids: List[str]
