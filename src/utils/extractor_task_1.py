# transcriptins from the meeting
from crewai import Task
from agents.extractor_agent_1 import extractor_agent

extractor_task = Task(
    description="{transcript}",
    agent=extractor_agent,
    expected_output=(
        "A single continuous paragraph that succinctly summarizes the core problem "
        "statement—no bullet points, lists, or line breaks."
    ),
    output_file="output/problem_statement_prompt.md",
)