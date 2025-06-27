from crewai import Task
from agents.research_agent_4 import research_agent
from constants import RESEARCH_BRIEF_PATH

research_task = Task(
    description=(
        "{selected_concept}\n\n"
        "And here is the prioritization result:\n"
        "{prioritization_result}\n\n"
        "As the Research Agent, conduct indept competitor Product and UI/UX analysis, pull user reviews & best practices, "
        "surface accessibility risks & complaints, and produce a concise research brief "
        "with the following sections:\n"
        "- Competitor Product, UI/UX Patterns\n"
        "- User Reviews & Sentiment\n"
        "- Accessibility Risks & Complaints\n"
        "- Best Practices & Recommendations\n"
    ),
    agent=research_agent,
    expected_output="A structured research brief covering all four sections.",
    output_file=RESEARCH_BRIEF_PATH,
)