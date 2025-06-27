from crewai import Task
from agents.brainstorm_agent_2 import brainstormer_agent
from constants import BRAINSTORM_OUTPUT_PATH

brainstorm_task = Task(
    description = "{problem_statement}",
    agent = brainstormer_agent,
    expected_output = "Three high-level concepts, each with benefits, drawbacks, in a Python List list-format "
        "technical feasibility + dependencies, and success metrics.",
    output_file=BRAINSTORM_OUTPUT_PATH,
)