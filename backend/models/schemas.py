from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ResumeBase(BaseModel):
    filename: str
    content: str

class ExtractedEntities(BaseModel):
    skills: List[str]
    education: List[str]
    experience: List[Dict[str, Any]]
    organizations: List[str]

class JobMatch(BaseModel):
    job_title: str
    match_score: float

class ResumeAnalysisResponse(BaseModel):
    filename: str
    extracted_entities: ExtractedEntities
    overall_score: float
    classification: str
    job_matches: List[JobMatch]
    skill_gaps: Dict[str, List[str]] # Key: job_title, Value: missing skills
