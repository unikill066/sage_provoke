from crewai import Task
from agents.creative_brief_agent_8 import creative_brief_agent
from constants import CREATIVE_BRIEF_PATH

creative_brief_task = Task(
    description=(
        "Problem Statement: {problem_statement}\n"
        "Selected Concept: {selected_concept}\n"
        "Persona Profile: {persona_profile}\n"
        "Prioritization Summary: {prioritization_result}\n"
        "Research Brief: {research_brief}\n\n"
        "Inspiration Board: {inspiration_result}\n"
        "Opportunity Map: {opportunity_result}\n"
        "Generate an export-ready Markdown creative brief."
    ),
    agent=creative_brief_agent,
    expected_output="A Markdown creative brief with titles, headings, UX goals, KPIs, and design guidance.",
    output_file=CREATIVE_BRIEF_PATH,
)