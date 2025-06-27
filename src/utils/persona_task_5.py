from crewai import Task
from agents.persona_agent_5 import persona_agent
from constants import PERSONA_OUTPUT_PATH

persona_task = Task(
    description=(
        "{selected_concept}\n\n"
        "Prioritization Results:\n{prioritization_result}\n\n"
        "Research Brief:\n{research_brief}\n\n"
        "User Demographic: {user_age}\n"
        "Industry/Domain: {user_domain}\n"  
        "\nAs the Persona Generator, build a behavioral persona profile." 
    ),
    agent=persona_agent,
    expected_output="A concise persona profile with name, bio, motivations, frustrations, accessibility needs, and concept relevance.",
    output_file=PERSONA_OUTPUT_PATH,
)