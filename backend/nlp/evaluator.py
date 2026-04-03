def calculate_score(extracted_data: dict) -> tuple:
    # Base score out of 100
    score = 0
    skills_count = len(extracted_data.get("skills", []))
    
    # Score from skills (Max 50 points)
    if skills_count >= 10:
        score += 50
    elif skills_count > 0:
        score += skills_count * 5
        
    # Score from experience (Max 30 points)
    exps = extracted_data.get("experience", [])
    years = 0
    if exps:
        years = exps[0].get("years", 0)
        if years >= 5:
            score += 30
        else:
            score += years * 5
            
    # Score from education/organizations (Max 20 points)
    has_edu = len(extracted_data.get("education", [])) > 0
    has_org = len(extracted_data.get("organizations", [])) > 0
    
    if has_edu:
        score += 10
    if has_org:
        score += 10
        
    # Classification
    if score >= 80:
        classification = "Advanced"
    elif score >= 50:
        classification = "Intermediate"
    else:
        classification = "Beginner"
        
    return score, classification
