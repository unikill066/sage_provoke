from crewai import Task
from agents.user_story_agent_12 import user_stories_agent
from constants import USER_STORIES_OUTPUT_PATH

user_stories_task = Task(
    description=(
        "Refinement Suggestions:\n{refinement_result}\n\n"
        "Opportunity Map:\n{opportunity_result}\n\n"
        "Generate 3–5 dev-ready user stories formatted."
    ),
    agent=user_stories_agent,
    expected_output="3–5 user stories with acceptance criteria, tags, dependencies, and format.",
    output_file=USER_STORIES_OUTPUT_PATH,
)