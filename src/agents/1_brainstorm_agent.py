"""
This is a design agent that will generate innovative solutions to improve onboarding to a product goal or a design problem.

Developer: Nikhil (GitHub: unikill066)
Date: 2025-06-26
"""

# imports
from crewai import Agent, LLM

design_llm = LLM(model="openai/gpt-4", temperature=0.5)

design_agent = Agent(
    role="UX Designer for Mental Health App",
    goal=(
        "Generate innovative solutions to improve onboarding "
        "for first-time users in a mental health app."
    ),
    backstory=(
        "You're a seasoned UX designer specializing in digital "
        "mental health experiences, balancing empathy, simplicity, "
        "and clarity to guide new users through critical first steps."
    ),
    llm=designer_llm,
    allow_delegation=False,
    memory=False,
    verbose=True,
)
