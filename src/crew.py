#!/usr/bin/env python
import os
from dotenv import load_dotenv
from crewai import Crew, Process
from agents.extractor_agent_1 import extractor_agent
from utils.extractor_task_1 import extractor_task
from bin.langchain_invocations import answer
from prompts.prompts import transcript1

load_dotenv()

TRANS_EXTRACTOR_DRAFT_PATH = "output/problem_statement_prompt.md"

crew = Crew(
    agents=[extractor_agent],
    tasks=[extractor_task],
    process=Process.sequential,
    verbose=True
)

def main():
    os.makedirs("output", exist_ok=True)
    crew.kickoff(inputs={"transcript": transcript1})
    
    with open(TRANS_EXTRACTOR_DRAFT_PATH) as f:
        final = f.read().strip()
    APPROVAL_KEYWORDS = {"ok", "cool", "great", "good", "yes", "y", "alright", "alrighty"}

    while True:
        resp = input("Edit it (type your feedback), or type one of [ok, cool, great, good, yes, y, alright, alrighty] to accept:\n").strip()
        if not resp or resp.lower() in APPROVAL_KEYWORDS:
            break
        revision_prompt = (
            "Please revise this Problem Statement Prompt to reflect the following feedback: "
            f'"{resp}"\n\nOriginal Prompt:\n{final}'
        )
        final = answer(revision_prompt).strip()

    with open(TRANS_EXTRACTOR_DRAFT_PATH, "w") as f:
        f.write(final + "\n")

if __name__ == "__main__":
    main()