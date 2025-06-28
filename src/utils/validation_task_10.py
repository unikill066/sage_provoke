from crewai import Task
from agents.validation_agent_10 import validation_agent
from constants import VALIDATION_REPORT_PATH

validation_task = Task(
    description=(
        "Creative Brief:\n{creative_brief}\n\n"
        "Persona Profile:\n{persona_profile}\n\n"
        "Opportunity Map:\n{opportunity_result}\n\n"
        "Wireframes & Prototype:\n{wireframe_result}\n\n"
        "As the Validation Agent, evaluate the design against the Product, UI/UX goals and user needs: perform heuristic checks, flag issues, and score effectiveness."
    ),
    agent=validation_agent,
    expected_output="A validation report with heuristics tested, flagged issues with recommendations, and effectiveness scores.",
    output_file=VALIDATION_REPORT_PATH,
)