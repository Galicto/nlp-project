import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def load_jobs_dataset():
    path = os.path.join(os.path.dirname(__file__), '../data/jobs_dataset.json')
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except:
        return [
            {"title": "Software Engineer", "requirements": ["python", "java", "sql", "git", "aws", "docker"]},
            {"title": "Data Scientist", "requirements": ["python", "machine learning", "sql", "pandas", "numpy", "tensorflow"]},
            {"title": "Frontend Developer", "requirements": ["javascript", "react", "html", "css", "nodejs", "typescript"]}
        ]

JOBS_DB = load_jobs_dataset()

def match_jobs(candidate_skills: list) -> list:
    if not candidate_skills:
        return []
    
    documents = [" ".join(candidate_skills)]
    job_titles = []
    
    for job in JOBS_DB:
        job_titles.append(job["title"])
        documents.append(" ".join(job["requirements"]))
        
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    # Compare candidate (index 0) with jobs (index 1 to N)
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    
    # Create matching results
    results = []
    for i, score in enumerate(cosine_similarities):
        results.append({
            "job_title": job_titles[i],
            "match_score": round(score * 100, 2)
        })
        
    # Sort by descending match score
    results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return results[:3] # Top 3 matches

def analyze_skill_gaps(candidate_skills: list, top_matches: list) -> dict:
    gaps = {}
    candidate_skills_set = set([s.lower() for s in candidate_skills])
    
    match_titles = [m["job_title"] for m in top_matches]
    for job in JOBS_DB:
        if job["title"] in match_titles:
            job_skills_set = set([s.lower() for s in job["requirements"]])
            missing = job_skills_set - candidate_skills_set
            if missing:
                gaps[job["title"]] = list(missing)
                
    return gaps
