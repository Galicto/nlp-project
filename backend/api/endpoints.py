from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
from models.schemas import ResumeAnalysisResponse, ExtractedEntities
from nlp.parser import extract_text_from_pdf, extract_text_from_docx
from nlp.pipeline import extract_entities
from nlp.matcher import match_jobs, analyze_skill_gaps
from nlp.evaluator import calculate_score
import json

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-resume", response_model=ResumeAnalysisResponse)
async def upload_and_analyze_resume(file: UploadFile = File(...)):
    if not (file.filename.endswith('.pdf') or file.filename.endswith('.docx')):
        raise HTTPException(status_code=400, detail="Only PDF or DOCX files are supported")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
            
        # 1. Parse Document
        raw_text = ""
        if file.filename.endswith('.pdf'):
            raw_text = extract_text_from_pdf(file_path)
        elif file.filename.endswith('.docx'):
            raw_text = extract_text_from_docx(file_path)
            
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from document")

        # 2. Extract Entities (NLP Pipeline)
        extracted_data = extract_entities(raw_text)
        
        # 3. Match Jobs
        job_matches = match_jobs(extracted_data['skills'])
        
        # 4. Score Resume
        score, classification = calculate_score(extracted_data)
        
        # 5. Skill Gaps
        skill_gaps = analyze_skill_gaps(extracted_data['skills'], job_matches)
        
        response = ResumeAnalysisResponse(
            filename=file.filename,
            extracted_entities=ExtractedEntities(**extracted_data),
            overall_score=score,
            classification=classification,
            job_matches=job_matches,
            skill_gaps=skill_gaps
        )
        return response
    except Exception as e:
        print(f"Error processing {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
