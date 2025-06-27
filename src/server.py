# File: src/server_tornado_extended.py
import os
import tornado.ioloop
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

os.makedirs("output", exist_ok=True)

# Helper for input validation
def _validate_input(fields, body):
    missing = [f for f in fields if body.get(f) is None]
    return missing

class ExtractService(RestHandler):
    @post(
        _path="/extract",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def extract(self, body):
        transcript = body.get("transcript")
        if not transcript:
            self.set_status(400)
            return {"error": "Missing 'transcript'."}
        prompt = run_extractor(transcript)
        return {"problem_statement": prompt}

class BrainstormService(RestHandler):
    @post(
        _path="/brainstorm",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def brainstorm(self, body):
        stmt = body.get("problem_statement")
        if not stmt:
            self.set_status(400)
            return {"error": "Missing 'problem_statement'."}
        ideas = run_brainstorm(stmt)
        return {"brainstorm": ideas}

class SelectConceptService(RestHandler):
    @post(
        _path="/select_concept",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def select(self, body):
        brainstorm = body.get("brainstorm")
        user_input = body.get("user_input")
        if not brainstorm or not user_input:
            self.set_status(400)
            return {"error": "Missing 'brainstorm' or 'user_input'."}
        # reuse select_concept logic
        # note: direct selection returns tuple
        stmt, num = select_concept(brainstorm)
        return {"selected_concept": stmt, "concept_num": num}

class PrioritizeService(RestHandler):
    @post(
        _path="/prioritize",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def prioritize(self, body):
        concept = body.get("selected_concept")
        if not concept:
            self.set_status(400)
            return {"error": "Missing 'selected_concept'."}
        result = run_prioritization(concept)
        return {"prioritization": result}

class ResearchService(RestHandler):
    @post(
        _path="/research",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def research(self, body):
        concept = body.get("selected_concept")
        prioritization = body.get("prioritization")
        missing = _validate_input(["selected_concept", "prioritization"], body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        brief = run_research(concept, prioritization)
        return {"research_brief": brief}

class PersonaService(RestHandler):
    @post(
        _path="/persona",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def persona(self, body):
        concept = body.get("selected_concept")
        prioritization = body.get("prioritization")
        research_brief = body.get("research_brief")
        user_age = body.get("user_age")
        user_domain = body.get("user_domain")
        missing = _validate_input(["selected_concept","prioritization","research_brief","user_age","user_domain"], body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        persona = run_persona(concept, prioritization, research_brief, user_age, user_domain)
        return {"persona_profile": persona}

class OpportunityService(RestHandler):
    @post(
        _path="/opportunity",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def opportunity(self, body):
        persona = body.get("persona_profile")
        research_brief = body.get("research_brief")
        prioritization = body.get("prioritization")
        missing = _validate_input(["persona_profile","research_brief","prioritization"], body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        result = run_opportunity_mapper(persona, research_brief, prioritization)
        return {"opportunity_map": result}

class InspirationService(RestHandler):
    @post(
        _path="/inspiration",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def inspiration(self, body):
        concept = body.get("selected_concept")
        persona = body.get("persona_profile")
        missing = _validate_input(["selected_concept","persona_profile"], body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        result = run_inspiration(concept, persona)
        return {"inspiration_board": result}

class CreativeBriefService(RestHandler):
    @post(
        _path="/creative_brief",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def creative_brief(self, body):
        fields = ["problem_statement","selected_concept","persona_profile","prioritization","research_brief","inspiration_board","opportunity_map"]
        missing = _validate_input(fields, body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        brief = creative_brief_loop(
            body["problem_statement"], body["selected_concept"], body["persona_profile"],
            body["prioritization"], body["research_brief"], body["inspiration_board"], body["opportunity_map"]
        )
        return {"creative_brief": brief}

class WireframeService(RestHandler):
    @post(
        _path="/wireframe",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def wireframe(self, body):
        brief = body.get("creative_brief")
        persona = body.get("persona_profile")
        missing = _validate_input(["creative_brief","persona_profile"], body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        wf = run_wireframe(brief, persona)
        return {"wireframes": wf}

class ValidationService(RestHandler):
    @post(
        _path="/validate",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def validate(self, body):
        brief = body.get("creative_brief")
        persona = body.get("persona_profile")
        opportunity = body.get("opportunity_map")
        wireframes = body.get("wireframes")
        missing = _validate_input(["creative_brief","persona_profile","opportunity_map","wireframes"], body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        report = run_validation(brief, persona, opportunity, wireframes)
        return {"validation_report": report}

class RefinementService(RestHandler):
    @post(
        _path="/refine",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def refine(self, body):
        report = body.get("validation_report")
        if not report:
            self.set_status(400)
            return {"error": "Missing 'validation_report'."}
        refinements = run_refinement(report)
        return {"refinement_suggestions": refinements}

class UserStoriesService(RestHandler):
    @post(
        _path="/user_stories",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def stories(self, body):
        refinements = body.get("refinement_suggestions")
        opportunity = body.get("opportunity_map")
        missing = _validate_input(["refinement_suggestions","opportunity_map"], body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        stories = run_user_stories(refinements, opportunity)
        return {"user_stories": stories}

class SprintPlanningService(RestHandler):
    @post(
        _path="/sprint_plan",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def sprint(self, body):
        stories = body.get("user_stories")
        opportunity = body.get("opportunity_map")
        sprint_length = body.get("sprint_length", 2)
        target_tool = body.get("target_tool", "Jira")
        missing = _validate_input(["user_stories","opportunity_map"], body)
        if missing:
            self.set_status(400)
            return {"error": f"Missing fields: {missing}"}
        plan = run_sprint_planning(stories, opportunity)
        return {"sprint_plan": plan}

if __name__ == "__main__":
    services = [
        ExtractService,
        BrainstormService,
        SelectConceptService,
        PrioritizeService,
        ResearchService,
        PersonaService,
        OpportunityService,
        InspirationService,
        CreativeBriefService,
        WireframeService,
        ValidationService,
        RefinementService,
        UserStoriesService,
        SprintPlanningService,
    ]
    print("🚀 Starting Tornado + pyRestful on http://0.0.0.0:8000")
    app = RestService(services)
    app.listen(8000)
    tornado.ioloop.IOLoop.instance().start()

    
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