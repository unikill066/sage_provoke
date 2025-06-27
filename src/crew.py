#!/usr/bin/env python
# imports
import os
from dotenv import load_dotenv
from crewai import Crew, Process
from agents.extractor_agent_1 import extractor_agent
from utils.extractor_task_1 import extractor_task
from bin.langchain_invocations import answer
from prompts.prompts import transcript1
from constants import TRANS_EXTRACTOR_DRAFT_PATH
from agents.brainstorm_agent_2 import brainstormer_agent
from utils.brainstorm_task_2 import brainstorm_task
from constants import BRAINSTORM_OUTPUT_PATH

# loading environment variables
load_dotenv()


def run_extractor(transcript):
    crew_ex = Crew(
        agents=[extractor_agent],
        tasks=[extractor_task],
        process=Process.sequential,
        verbose=True
    )
    crew_ex.kickoff(inputs={"transcript": transcript})

    # load and manually polish
    with open(TRANS_EXTRACTOR_DRAFT_PATH) as f:
        draft = f.read().strip()

    APPROVAL = {"ok","yes","y","great","good","cool","alright","alrighty"}
    while True:
        print("\n── CURRENT PROBLEM STATEMENT ──\n")
        print(draft, "\n")
        resp = input("Feedback or type ✅ to accept:\n").strip().lower()
        if resp in APPROVAL or not resp:
            print("✅ Approved.\n")
            break
        # use your existing `answer(...)` helper to revise
        revision = (
            "Please revise this Problem Statement Prompt to reflect the following feedback: "
            f"“{resp}”\n\nOriginal Prompt:\n{draft}"
        )
        draft = answer(revision).strip()

    # save final
    with open(TRANS_EXTRACTOR_DRAFT_PATH, "w") as f:
        f.write(draft + "\n")
    return draft


def run_brainstorm(problem_statement):
    crew_br = Crew(
        agents=[brainstormer_agent],
        tasks=[brainstorm_task],
        process=Process.sequential,
        verbose=True
    )
    crew_br.kickoff(inputs={"problem_statement": problem_statement})
    with open(BRAINSTORM_OUTPUT_PATH) as f:
        result = f.read().strip()

    print(f"\n✅ Brainstorm output written to {BRAINSTORM_OUTPUT_PATH}\n")
    return result


def main(transcript):
    os.makedirs("output", exist_ok=True)
    # Phase 1: extractor + manual loop
    problem_statement = run_extractor(transcript1)
    # Phase 2: brainstorming
    brainstrom_list = run_brainstorm(problem_statement)
    print(type(brainstrom_list))
main(transcript1)