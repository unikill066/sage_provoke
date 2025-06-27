from crewai import Task
from agents.wireframe_agent_9 import wireframe_agent
from constants import WIREFRAME_OUTPUT_PATH

wireframe_task = Task(
    description=(
        "Creative Brief:\n{creative_brief}\n\n"
        "Persona Profile:\n{persona_profile}\n\n"
        "As the Wireframe & Prototype Agent, generate the user journey, detailed wireframes with annotations, and export options."
    ),
    agent=wireframe_agent,
    expected_output="A user journey list, 3+ annotated wireframe screens with tool-generated sketches, and Figma/design tokens export.",
    output_file=WIREFRAME_OUTPUT_PATH,
)