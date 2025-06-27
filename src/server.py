# src/server.py
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests

# Import the pre-configured Crew instance and output path from `crew.py`
from crew import crew as crew_extract, TRANS_EXTRACTOR_DRAFT_PATH

os.makedirs("output", exist_ok=True)

app = FastAPI(title="SAGE Backend API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class TranscriptRequest(BaseModel):
    transcript: str
    phase: int = 1  # Default to phase 1

class JiraStory(BaseModel):
    summary: str
    description: str

@app.get("/extract")
async def extract_get(transcript: str, phase: int = 1):
    """GET endpoint for transcript extraction"""
    return await _do_extract(transcript, phase)

@app.post("/extract")
async def extract_post(request: TranscriptRequest):
    """POST endpoint for transcript extraction"""
    return await _do_extract(request.transcript, request.phase)

@app.post("/api/jira/create-story")
async def create_jira_story(story: JiraStory, request: Request):
    jira_url = os.environ.get('JIRA_URL')
    jira_email = os.environ.get('JIRA_EMAIL')
    jira_token = os.environ.get('JIRA_API_TOKEN')
    jira_project = os.environ.get('JIRA_PROJECT_KEY')
    if not all([jira_url, jira_email, jira_token, jira_project]):
        raise HTTPException(status_code=500, detail="Jira credentials are not fully configured in environment variables.")
    url = f"{jira_url}/rest/api/3/issue"
    auth = (jira_email, jira_token)
    headers = {"Accept": "application/json", "Content-Type": "application/json"}
    
    # Convert description to Atlassian Document Format
    description_adf = {
        "version": 1,
        "type": "doc",
        "content": [
            {
                "type": "paragraph",
                "content": [
                    {
                        "type": "text",
                        "text": story.description
                    }
                ]
            }
        ]
    }
    
    payload = {
        "fields": {
            "project": {"key": jira_project},
            "summary": story.summary,
            "description": description_adf,
            "issuetype": {"name": "Story"}
        }
    }
    response = requests.post(url, json=payload, headers=headers, auth=auth)
    if response.status_code >= 400:
        return {"error": response.text, "status": response.status_code}
    return response.json()

async def _do_extract(transcript: str, phase: int = 1):
    """Extract information from transcript using CrewAI based on phase"""
    if not transcript:
        raise HTTPException(status_code=400, detail="Missing 'transcript'.")
    
    try:
        if phase == 2:
            # Phase 2: Business Requirements
            business_requirements_prompt = f"""
            Based on the following context, please provide detailed business requirements:
            
            {transcript}
            
            Please structure your response to include:
            1. Functional Requirements
            2. Non-Functional Requirements  
            3. Business Rules
            4. User Stories
            5. Acceptance Criteria
            
            Focus on business value, stakeholder needs, and measurable outcomes.
            """
            
            # Use the existing crew for now, but with business requirements focus
            crew_extract.kickoff(inputs={"transcript": business_requirements_prompt})
        elif phase == 3:
            # Phase 3: Design Options
            design_options_prompt = f"""
            Based on the following strategic planning and business requirements, please provide 3 distinct design and UX approaches:
            
            {transcript}
            
            Please provide 3 design options, each with:
            1. Design Philosophy & Approach
            2. Key UX Principles
            3. Visual Style Direction
            4. User Interface Strategy
            5. Interaction Patterns
            6. Accessibility Considerations
            
            Make each option distinctly different in approach and style.
            """
            
            crew_extract.kickoff(inputs={"transcript": design_options_prompt})
        else:
            # Default processing for other phases
            crew_extract.kickoff(inputs={"transcript": transcript})
        
        path = TRANS_EXTRACTOR_DRAFT_PATH
        if not os.path.exists(path):
            raise HTTPException(status_code=500, detail="Extraction failed - no output file generated.")
        
        result = open(path).read().strip()
        return {"prompt": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "SAGE Backend is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)