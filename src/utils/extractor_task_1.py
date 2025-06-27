# transcriptins from the meeting
from crewai import Task
from agents.extractor_agent_1 import extractor_agent
from constants import TRANS_EXTRACTOR_DRAFT_PATH

extractor_task = Task(
    description="{transcript}",
    agent=extractor_agent,
    expected_output=(
        "A single continuous paragraph that succinctly summarizes the core problem "
        "statement—no bullet points, lists, or line breaks."
    ),
    output_file=TRANS_EXTRACTOR_DRAFT_PATH,
)