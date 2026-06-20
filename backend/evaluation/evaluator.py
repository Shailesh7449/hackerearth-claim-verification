import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def evaluate_strategies(ground_truth_df: pd.DataFrame, predictions_a: list, predictions_b: list) -> str:
    """
    Compares Strategy A (rule-based) and Strategy B (Gemini Vision + rules).
    """
    y_true = ground_truth_df['claim_status'].tolist()
    
    acc_a = accuracy_score(y_true, predictions_a)
    prec_a = precision_score(y_true, predictions_a, average='weighted', zero_division=0)
    rec_a = recall_score(y_true, predictions_a, average='weighted', zero_division=0)
    f1_a = f1_score(y_true, predictions_a, average='weighted', zero_division=0)
    
    acc_b = accuracy_score(y_true, predictions_b)
    prec_b = precision_score(y_true, predictions_b, average='weighted', zero_division=0)
    rec_b = recall_score(y_true, predictions_b, average='weighted', zero_division=0)
    f1_b = f1_score(y_true, predictions_b, average='weighted', zero_division=0)
    
    report = f"""# Evaluation Report

## Strategy A (Rule-Based)
- Accuracy: {acc_a:.4f}
- Precision: {prec_a:.4f}
- Recall: {rec_a:.4f}
- F1 Score: {f1_a:.4f}

## Strategy B (Gemini Vision + Rules)
- Accuracy: {acc_b:.4f}
- Precision: {prec_b:.4f}
- Recall: {rec_b:.4f}
- F1 Score: {f1_b:.4f}
"""
    return report
