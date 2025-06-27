from crewai import Task
from agents.refinement_agent_11 import refinement_agent
from constants import REFINEMENT_OUTPUT_PATH

refinement_task = Task(
    description=(
        "Wireframes & Prototype:\n{wireframe_output}\n\n"
        "Validation Report:\n{validation_report}\n\n"
        "As the Refinement Agent, suggest UI tweaks, copy improvements, and A/B test variants to make this design sprint-ready."
    ),
    agent=refinement_agent,
    expected_output="Three bullet sections: UI Tweaks, Copy Improvements, A/B Test Variants.",
    output_file=REFINEMENT_OUTPUT_PATH,
)