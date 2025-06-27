from crewai import Task
from agents.inspiration_agent_7 import inspiration_agent
from constants import INSPIRATION_OUTPUT_PATH

inspiration_task = Task(
    description=(
        "{selected_concept}\n\n"
        "Persona Profile:\n{persona_profile}\n\n"
        "As the Inspiration Agent, gather annotated UI examples and patterns from live sources, "
        "and compile a visual inspiration board."
    ),
    agent=inspiration_agent,
    expected_output="A list of ≥5 UI patterns with product, source URL, pattern description, and annotation.",
    output_file=INSPIRATION_OUTPUT_PATH,
)