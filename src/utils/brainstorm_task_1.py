# transcriptins from the meeting
from crewai import Task
from agents.brainstorm_agent_1 import extractor_agent

extract_transcript_task = Task(
    # We let the system prompt do the heavy lifting;
    # here we just feed it the raw transcript.
    description="{transcript}",
    agent=extractor_agent,
    expected_output=(
        "A Markdown document with two sections:\n"
        "### TASKS & ACTION ITEMS\n"
        "- …\n\n"
        "### IDEAS & SUGGESTIONS\n"
        "- …"
    ),
    output_file="output/extracted_meeting_items.md",
)
