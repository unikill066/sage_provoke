from crewai import Task
from agents.opportunity_mapper_agent_6 import opportunity_agent
from constants import OPPORTUNITY_OUTPUT_PATH

opportunity_task = Task(
    description=(
        "{persona_profile}\n\n"
        "Research Brief:\n{research_brief}\n\n"
        "Prioritization Summary:\n{prioritization_result}\n\n"
        "As the Opportunity Mapper, translate these into JTBD, key Product/UI/UX moments, and success metrics."
    ),
    agent=opportunity_agent,
    expected_output="A structured map: JTBD, 3 key moments, and 3 success metrics.",
    output_file=OPPORTUNITY_OUTPUT_PATH,
)