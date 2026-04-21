from http.server import BaseHTTPRequestHandler
import json, re, tempfile, os, io, cgi

try:
    import fitz
    HAS_FITZ = True
except ImportError:
    HAS_FITZ = False

try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

SKILLS_DB = {
    "python", "java", "javascript", "react", "sql", "aws", "docker",
    "c++", "nodejs", "typescript", "html", "css", "pandas", "numpy",
    "tensorflow", "machine learning", "git", "kubernetes", "mongodb",
    "postgresql", "mysql", "flask", "django", "fastapi", "vue", "angular",
    "scala", "spark", "linux", "bash", "ruby", "php", "swift", "kotlin",
    "go", "rust", "azure", "gcp", "pytorch", "scikit-learn", "redis",
    "graphql", "rest api", "microservices", "ci/cd", "terraform", "jenkins"
}

JOBS = [
    {"title": "Software Engineer",    "requirements": ["python", "java", "sql", "git", "aws", "docker"]},
    {"title": "Data Scientist",       "requirements": ["python", "machine learning", "sql", "pandas", "numpy", "tensorflow"]},
    {"title": "Frontend Developer",   "requirements": ["javascript", "react", "html", "css", "nodejs", "typescript"]},
]

def extract_skills(text):
    t = text.lower()
    return [s for s in SKILLS_DB if re.search(r'\b' + re.escape(s) + r'\b', t)]

def match_jobs(skills):
    ss = set(skills)
    results = []
    for job in JOBS:
        req = set(job["requirements"])
        score = round(len(ss & req) / len(req) * 100, 2) if req else 0
        results.append({"job_title": job["title"], "match_score": score})
    return sorted(results, key=lambda x: x["match_score"], reverse=True)

def calculate_score(skills, years=0):
    score = min(len(skills) * 5, 50) + min(years * 6, 30) + (20 if years > 0 else 0)
    score = min(score, 100)
    cls = "Advanced" if score >= 80 else "Intermediate" if score >= 50 else "Beginner"
    return score, cls

class handler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            ct = self.headers.get("Content-Type", "")
            cl = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(cl)

            fs = cgi.FieldStorage(
                fp=io.BytesIO(body),
                headers=self.headers,
                environ={"REQUEST_METHOD": "POST", "CONTENT_TYPE": ct, "CONTENT_LENGTH": str(cl)}
            )

            if "file" not in fs:
                return self._send_json({"error": "No file provided"}, 400)

            item = fs["file"]
            filename = item.filename or "resume"
            data = item.file.read()

            raw_text = ""
            if filename.lower().endswith(".pdf") and HAS_FITZ:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(data); path = tmp.name
                try:
                    doc = fitz.open(path)
                    for page in doc: raw_text += page.get_text()
                    doc.close()
                finally:
                    os.unlink(path)
            elif filename.lower().endswith(".docx") and HAS_DOCX:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
                    tmp.write(data); path = tmp.name
                try:
                    document = docx.Document(path)
                    raw_text = "\n".join(p.text for p in document.paragraphs)
                finally:
                    os.unlink(path)

            if not raw_text.strip():
                return self._send_json({"error": "Could not extract text. Ensure it is a valid PDF or DOCX."}, 400)

            skills = extract_skills(raw_text)
            exp = re.findall(r'(\d+)\s*\+?\s*(?:years?|yrs?)\s+of\s+experience', raw_text, re.IGNORECASE)
            years = max([int(x) for x in exp], default=0) if exp else 0

            job_matches = match_jobs(skills)
            score, cls = calculate_score(skills, years)

            top_titles = {m["job_title"] for m in job_matches[:3]}
            skill_gaps = {
                job["title"]: list(set(job["requirements"]) - set(skills))
                for job in JOBS if job["title"] in top_titles
                if set(job["requirements"]) - set(skills)
            }

            self._send_json({
                "filename": filename,
                "extracted_entities": {
                    "skills": skills,
                    "education": [],
                    "experience": [{"type": "years_parsed", "years": years}] if years else [],
                    "organizations": []
                },
                "overall_score": score,
                "classification": cls,
                "job_matches": job_matches,
                "skill_gaps": skill_gaps
            })
        except Exception as e:
            self._send_json({"error": str(e)}, 500)
