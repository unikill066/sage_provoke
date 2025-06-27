from crewai import Task
from agents.prioritization_agent_3 import prioritization_agent
from constants import PRIORITIZATION_OUTPUT_PATH

prioritization_task = Task(
    description=(
        "{selected_concept}\n\n"
        "As the Prioritization Agent, please rank and prioritize this concept "
        "according to feasibility and ROI, flag fast wins or high-risk bets, "
        "and recommend the top concept to pursue."
    ),
    agent=prioritization_agent,
    expected_output=(
        "A ranked list of the 3 concepts plus a final recommendation with rationale."
    ),
    output_file=PRIORITIZATION_OUTPUT_PATH,
)
