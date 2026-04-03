import spacy
import re
import json
import os

try:
    nlp = spacy.load("en_core_web_md")
except:
    print("Please run: python -m spacy download en_core_web_md")

def load_skills_taxonomy():
    path = os.path.join(os.path.dirname(__file__), '../data/skills_taxonomy.json')
    try:
        with open(path, 'r') as f:
            return set([s.lower() for s in json.load(f)])
    except:
        return set(["python", "java", "c++", "react", "javascript", "sql", "aws", "docker"])

SKILLS_DB = load_skills_taxonomy()

def normalize_skill(skill_str: str) -> str:
    # Example normalization mapping
    mapping = {
        "js": "javascript",
        "reactjs": "react",
        "node": "nodejs",
        "aws": "amazon web services",
        "ml": "machine learning"
    }
    return mapping.get(skill_str.lower(), skill_str.lower())

def extract_entities(text: str) -> dict:
    doc = nlp(text)
    
    extracted = {
        "skills": set(),
        "education": [],
        "experience": [],
        "organizations": set()
    }
    
    # Simple extraction logic based on NER and Pattern Matching
    for ent in doc.ents:
        if ent.label_ == "ORG":
            extracted["organizations"].add(ent.text)
        elif ent.label_ == "ORG":  # universities often get flagged as ORG
            if "university" in ent.text.lower() or "college" in ent.text.lower() or "institute" in ent.text.lower():
                extracted["education"].append(ent.text)
                
    # Token-based extraction for skills
    tokens = [token.text for token in doc if not token.is_stop and not token.is_punct]
    
    # N-gram matching for skills (up to 2-grams for simple matching)
    for i in range(len(tokens)):
        # unigram
        w1 = normalize_skill(tokens[i])
        if w1 in SKILLS_DB:
            extracted["skills"].add(w1)
        # bigram
        if i < len(tokens) - 1:
            w2 = normalize_skill(f"{tokens[i]} {tokens[i+1]}")
            if w2 in SKILLS_DB:
                extracted["skills"].add(w2)
                
    # Simple RegEx for experience lookup (basic MVP approach)
    exp_pattern = re.findall(r'(\d+)\s*\+?\s*(years|yrs)\s+of\s+experience', text, re.IGNORECASE)
    if exp_pattern:
        years = max([int(x[0]) for x in exp_pattern])
        extracted["experience"].append({"type": "years_parsed", "years": years})

    return {
        "skills": list(extracted["skills"]),
        "education": list(set(extracted["education"])),
        "experience": extracted["experience"],
        "organizations": list(extracted["organizations"])
    }
