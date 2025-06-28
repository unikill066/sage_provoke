import os
import tornado.ioloop
from dotenv import load_dotenv
from pyrestful import mediatypes
from pyrestful.rest import post, RestHandler, RestService

# Import pipeline functions from crew.py
from crew import (
    run_extractor,
    run_brainstorm,
    select_concept,
    run_prioritization,
    run_research,
    run_persona,
    run_opportunity_mapper,
    run_inspiration,
    creative_brief_loop,
    run_wireframe,
    run_validation,
    run_refinement,
    run_user_stories,
    run_sprint_planning
)

# Load env and ensure output dir
load_dotenv()
os.makedirs("output", exist_ok=True)

class PipelineService(RestHandler):
    @post(
        _path="/pipeline",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def pipeline(self, body):
        # Required inputs
        transcript = body.get("transcript")
        user_age   = body.get("user_age")
        user_domain= body.get("user_domain")
        # Optional
        sprint_length = body.get("sprint_length", 2)
        target_format = body.get("target_format", "Jira")

        # Validate
        missing = [f for f in ("transcript","user_age","user_domain") if not body.get(f)]
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}

        # Run pipeline
        try:
            problem       = run_extractor(transcript)
            brainstorm    = run_brainstorm(problem)
            selected, idx = select_concept(brainstorm)
            prioritization= run_prioritization(selected)
            research      = run_research(selected, prioritization)
            persona       = run_persona(selected, prioritization, research, user_age, user_domain)
            opportunity   = run_opportunity_mapper(persona, research, prioritization)
            inspiration   = run_inspiration(selected, persona)
            creative      = creative_brief_loop(
                                problem, selected, persona, prioritization,
                                research, inspiration, opportunity
                             )
            wireframe     = run_wireframe(creative, persona)
            validation    = run_validation(creative, persona, opportunity, wireframe)
            refinement    = run_refinement(validation)
            stories       = run_user_stories(refinement, opportunity)
            sprint        = run_sprint_planning(stories, opportunity)
        except Exception as e:
            self.set_status(500)
            return {"error": str(e)}

        # Response
        return {
            "problem_statement": problem,
            "brainstorm": brainstorm,
            "selected_concept": selected,
            "concept_num": idx,
            "prioritization": prioritization,
            "research_brief": research,
            "persona_profile": persona,
            "opportunity_map": opportunity,
            "inspiration_board": inspiration,
            "creative_brief": creative,
            "wireframes": wireframe,
            "validation_report": validation,
            "refinement_suggestions": refinement,
            "user_stories": stories,
            "sprint_plan": sprint
        }

if __name__ == "__main__":
    print("🚀 Starting Tornado + pyRestful on http://0.0.0.0:8000")
    app = RestService([PipelineService])
    app.listen(8000)
    tornado.ioloop.IOLoop.instance().start()



#######
    
# # src/server_tornado.py
# import os, tornado.ioloop
# from pyrestful import mediatypes
# from pyrestful.rest import get, post, RestHandler, RestService

# # Import the pre-configured Crew instance and output path from `crew.py`
# from crew import crew as crew_extract, TRANS_EXTRACTOR_DRAFT_PATH

# os.makedirs("output", exist_ok=True)

# # `crew_extract` is imported from `crew.py` – no need to redeclare it here.


# class ExtractService(RestHandler):
#     def _do_extract(self, transcript):
#         if not transcript:
#             self.set_status(400)
#             return {"error": "Missing 'transcript'."}

#         crew_extract.kickoff(inputs={"transcript": transcript})
#         path = TRANS_EXTRACTOR_DRAFT_PATH
#         if not os.path.exists(path):
#             self.set_status(500)
#             return {"error": "Extraction failed."}

#         return {"prompt": open(path).read().strip()}

#     @get(
#         _path="/extract",
#         _produces=mediatypes.APPLICATION_JSON,
#         _query=[{"name": "transcript", "type": str, "required": True}],
#     )
#     def extract_get(self, transcript):
#         return self._do_extract(transcript)

#     @post(
#         _path="/extract",
#         _consumes=mediatypes.APPLICATION_JSON,
#         _produces=mediatypes.APPLICATION_JSON,
#     )
#     def extract_post(self, body):
#         transcript = body.get("transcript")
#         return self._do_extract(transcript)

    


# if __name__ == "__main__":
#     print("🚀 Starting Tornado + pyRestful on http://0.0.0.0:8000")
#     app = RestService([ExtractService])
#     app.listen(8000)
#     tornado.ioloop.IOLoop.instance().start()