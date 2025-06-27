from crewai import Task
from agents.sprint_planning_agent_13 import sprint_planning_agent
from constants import SPRINT_PLANNING_OUTPUT_PATH

sprint_planning_task = Task(
    description=(
        "User Stories:\n{user_stories}\n\n"
        "Generate a prioritized, role-based sprint plan, flag dependencies/risks, and export for {target_tool}."
    ),
    agent=sprint_planning_agent,
    expected_output="A sprint plan with phases, roles, stories, risks, and export format.",
    output_file=SPRINT_PLANNING_OUTPUT_PATH,
)