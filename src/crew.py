#!/usr/bin/env python
# imports
import os
from dotenv import load_dotenv
from crewai import Crew, Process
from agents.extractor_agent_1 import extractor_agent
from utils.extractor_task_1 import extractor_task
from bin.langchain_invocations import answer
from prompts.prompts import transcript1
# from agents.brainstorm_agent_2 import brainstorm_agent
# from utils.brainstorm_task_2 import idea_brainstorm_task

# loading environment variables
load_dotenv()

TRANS_EXTRACTOR_DRAFT_PATH = "output/problem_statement_prompt.md"

# 1) Assemble the crew
crew = Crew(
    agents=[extractor_agent],
    tasks=[extractor_task],
    process=Process.sequential,
    verbose=True
)

def main():
    os.makedirs("output", exist_ok=True)  # creates the output dir
    # transcript = """<PASTE YOUR TRANSCRIPT HERE>"""
    crew.kickoff(inputs={"transcript": transcript1})
    
    with open(TRANS_EXTRACTOR_DRAFT_PATH) as f:
        final = f.read().strip()
    APPROVAL_KEYWORDS = {"ok", "cool", "great", "good", "yes", "y", "alright", "alrighty"}

    while True:
        print("\n CURRENT DRAFT:\n")
        print(final, "\n")
        resp = input("Edit it (type your feedback), or type one of [ok, cool, great, good, yes, y, alright, alrighty] to accept:\n").strip()
        if not resp or resp.lower() in APPROVAL_KEYWORDS:
            print("✅ Approved.\n")
            break
        print("🤖 Regenerating draft based on your feedback…")
        revision_prompt = (
            "Please revise this Problem Statement Prompt to reflect the following feedback: "
            f"“{resp}”\n\nOriginal Prompt:\n{final}"
        )
        final = answer(revision_prompt).strip()
        print("\n UPDATED DRAFT \n")

    with open(TRANS_EXTRACTOR_DRAFT_PATH, "w") as f:
        f.write(final + "\n")

    print(f"\n Final prompt saved to {TRANS_EXTRACTOR_DRAFT_PATH}\n")

if __name__ == "__main__":
    main()