import pandas as pd

def check_risk(user_id: str, object_type: str, user_history_df: pd.DataFrame) -> str:
    """
    Analyzes user_history to flag suspicious activity.
    Rules:
    - High claim frequency (e.g. >3 claims in past year)
    - Repeated claims for the same object_type
    Returns 'none' if no risk, or a string describing the risk flags.
    """
    if user_history_df is None or user_history_df.empty:
        return "none"
        
    # Filter history for this user
    user_records = user_history_df[user_history_df['user_id'] == user_id]
    
    if user_records.empty:
        return "none"
        
    flags = []
    
    # Check total claims
    total_claims = len(user_records)
    if total_claims > 3:
        flags.append("High claim frequency")
        
    # Check repeated objects
    object_claims = user_records[user_records['object_type'] == object_type]
    if len(object_claims) > 1:
        flags.append(f"Repeated claims for {object_type}")
        
    # Check if previously flagged for fraud
    if 'fraud_flag' in user_records.columns and user_records['fraud_flag'].any():
        flags.append("Previous fraud flag detected")
        
    if not flags:
        return "none"
        
    return ", ".join(flags)
