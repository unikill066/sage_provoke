#!/usr/bin/env python
from crewai import Crew, Process
from agents.brainstorm_agent_1 import extractor_agent
from utils.brainstorm_task_1 import extract_transcript_task

# Assemble the crew
crew = Crew(
    agents=[extractor_agent],
    tasks=[extract_transcript_task],
    process=Process.sequential,
    verbose=True
)

if __name__ == "__main__":
    # Suppose you have your transcript in a variable:
    transcript = """
    Nikhil: I want tp build an Iron Man
    Kevin: Yes, but Iron Man is already built
    Nikhil: This Iron Man will be different
    Kevin: How?
    Nikhil: It will be a robot
    Kevin: A robot?
    Nikhil: Yes, a robot
    Kevin: A robot?
    Nikhil: Yes, a robot
    Kevin: A robot?
    Nikhil: Yes, a robot
    """

    crew.kickoff(inputs={
        "transcript": transcript
    })
