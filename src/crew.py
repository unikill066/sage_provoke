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
from utils.prioritization_task_3 import prioritization_task
from agents.prioritization_agent_3 import prioritization_agent
from constants import PRIORITIZATION_OUTPUT_PATH
from agents.research_agent_4 import research_agent
from utils.research_task_4 import research_task
from constants import RESEARCH_BRIEF_PATH
from agents.persona_agent_5 import persona_agent
from utils.persona_task_5 import persona_task
from constants import PERSONA_OUTPUT_PATH
from agents.opportunity_mapper_agent_6 import opportunity_agent
from utils.opportunity_mapper_task_6 import opportunity_task
from constants import OPPORTUNITY_OUTPUT_PATH
from agents.inspiration_agent_7 import inspiration_agent
from utils.inspiration_task_7 import inspiration_task
from constants import INSPIRATION_OUTPUT_PATH
from agents.creative_brief_agent_8 import creative_brief_agent
from utils.creative_brief_task_8 import creative_brief_task
from constants import CREATIVE_BRIEF_PATH
from agents.wireframe_agent_9 import wireframe_agent
from utils.wireframe_task_9 import wireframe_task
from constants import WIREFRAME_OUTPUT_PATH
from agents.validation_agent_10 import validation_agent
from utils.validation_task_10 import validation_task
from constants import VALIDATION_REPORT_PATH
from agents.refinement_agent_11 import refinement_agent
from utils.refinement_task_11 import refinement_task
from constants import REFINEMENT_OUTPUT_PATH
from agents.user_story_agent_12 import user_stories_agent
from utils.user_story_task_12 import user_stories_task
from constants import USER_STORIES_OUTPUT_PATH
from agents.sprint_planning_agent_13 import sprint_planning_agent
from utils.sprint_planning_task_13 import sprint_planning_task
from constants import SPRINT_PLANNING_OUTPUT_PATH

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

def select_concept(brainstorm_result):
    def _extract_concept_from_brainstorm(brainstorm_text, concept_num):
        """Fallback method to extract concept from brainstorm text"""
        lines = brainstorm_text.split('\n')
        selected_concept_lines = []
        capturing = False
        
        for line in lines:
            if line.startswith(f"{concept_num}. Concept:"):
                capturing = True
            elif line.startswith(f"{concept_num + 1}. Concept:") or (concept_num == 3 and line.strip() == ""):
                break
            
            if capturing:
                selected_concept_lines.append(line)
        
        return '\n'.join(selected_concept_lines).strip()
    
    while True:
        user_input = input("Which concept would you like to proceed with? (mention 1, 2, or 3 in your response): ").strip()
        
        if not user_input:
            print("Please provide your input about which concept you'd like to choose.\n")
            continue
    
        analysis_prompt = (
            f"Based on these three brainstormed concepts:\n\n{brainstorm_result}\n\n"
            f"User said: '{user_input}'\n\n"
            f"Please analyze if the user mentioned wanting concept 1, 2, or 3. "
            f"If they clearly mentioned a specific concept number (1, 2, or 3), "
            f"respond with 'CONCEPT_X' followed by '|||' then the full concept details where X is the number. "
            f"Format: 'CONCEPT_X|||[full concept text here]' "
            f"If they did NOT mention a specific concept number, respond with 'NO_CONCEPT' and ask them to specify which concept they want."
        )
        
        ai_response = answer(analysis_prompt).strip()
        
        # Process the AI response
        if ai_response.startswith("CONCEPT_"):
            try:
                # Split the response to get concept number and content
                if "|||" in ai_response:
                    concept_part, selected_concept = ai_response.split("|||", 1)
                    concept_num = int(concept_part.split("_")[1])
                    selected_concept = selected_concept.strip()
                else:
                    # Fallback: extract concept number and manually parse from brainstorm_result
                    concept_num = int(ai_response.split("_")[1])
                    selected_concept = _extract_concept_from_brainstorm(brainstorm_result, concept_num)
                
                if concept_num in [1, 2, 3]:
                    return selected_concept, concept_num
                    
            except (IndexError, ValueError):
                continue
        
        elif ai_response.startswith("NO_CONCEPT"):
            continue  # Ask again
        
        else:
            continue

def run_prioritization(selected_concept):
    crew_pr = Crew(
        agents=[prioritization_agent],
        tasks=[prioritization_task],
        process=Process.sequential,
        verbose=True
    )
    crew_pr.kickoff(inputs={"selected_concept": selected_concept})
    with open(PRIORITIZATION_OUTPUT_PATH) as f:
        result = f.read().strip()
    return result

def run_research(selected_concept, prioritization_result):
    crew_rs = Crew(
        agents=[research_agent],
        tasks=[research_task],
        process=Process.sequential,
        verbose=True
    )
    crew_rs.kickoff(inputs={"selected_concept": selected_concept, "prioritization_result": prioritization_result})
    with open(RESEARCH_BRIEF_PATH) as f:
        brief = f.read().strip()
    return brief

def run_persona(selected_concept, prioritization_result, research_brief, user_age, user_domain):
    crew_p5 = Crew(agents=[persona_agent], tasks=[persona_task], process=Process.sequential, verbose=True)
    crew_p5.kickoff(inputs={
    "selected_concept": selected_concept,
    "prioritization_result": prioritization_result,
    "research_brief": research_brief,
    "user_age": user_age,
    "user_domain": user_domain,
    })
    with open(PERSONA_OUTPUT_PATH) as f:
        persona_profile = f.read().strip()
    return persona_profile

def run_opportunity_mapper(persona_profile, research_brief, prioritization_result):
    crew_op = Crew(agents=[opportunity_agent], tasks=[opportunity_task], process=Process.sequential, verbose=True)
    crew_op.kickoff(inputs={
    "persona_profile": persona_profile,
    "research_brief": research_brief,
    "prioritization_result": prioritization_result,
    })
    with open(OPPORTUNITY_OUTPUT_PATH) as f:
        opportunity_result = f.read().strip()
    return opportunity_result

def run_inspiration(selected_concept, persona_profile):
    crew_insp = Crew(agents=[inspiration_agent], tasks=[inspiration_task], process=Process.sequential, verbose=True)
    crew_insp.kickoff(inputs={
    "selected_concept": selected_concept,
    "persona_profile": persona_profile,
    })
    with open(INSPIRATION_OUTPUT_PATH) as f:
        inspiration_result = f.read().strip()
    return inspiration_result

def run_creative_brief(problem_statement, selected_concept, persona_profile, prioritization_result, research_brief, inspiration_result, opportunity_result):
    crew_cb = Crew(agents=[creative_brief_agent], tasks=[creative_brief_task], process=Process.sequential, verbose=True)
    crew_cb.kickoff(inputs={
    "problem_statement": problem_statement,
    "selected_concept": selected_concept,
    "persona_profile": persona_profile,
    "prioritization_result": prioritization_result,
    "research_brief": research_brief,
    "inspiration_result": inspiration_result,
    "opportunity_result": opportunity_result,
    })
    with open(CREATIVE_BRIEF_PATH) as f:
        creative_brief = f.read().strip()
    return creative_brief

def creative_brief_loop(problem_statement, selected_concept, persona_profile, prioritization_result, research_brief, inspiration_result, opportunity_result):
    brief = run_creative_brief(problem_statement, selected_concept, persona_profile, prioritization_result, research_brief, inspiration_result, opportunity_result)
    while True:
        feedback = input("Enter feedback to revise, or press Enter to accept:\n").strip()
        if not feedback:
            break
        revise_prompt = (
            f"Please revise the creative brief to incorporate this feedback: '{feedback}'\n\n" 
            f"Original Brief:\n{brief}"
        )
        brief = answer(revise_prompt).strip()
    with open(CREATIVE_BRIEF_PATH, 'w') as f:
        f.write(brief + '\n')
    print(f"Creative brief saved to {CREATIVE_BRIEF_PATH}")
    return brief

def run_wireframe(creative_brief, persona_profile):
    crew_wf = Crew(agents=[wireframe_agent], tasks=[wireframe_task], process=Process.sequential, verbose=True)
    crew_wf.kickoff(inputs={
    "creative_brief": creative_brief,
    "persona_profile": persona_profile,
    })
    with open(WIREFRAME_OUTPUT_PATH) as f:
        wireframe_output = f.read().strip()
    return wireframe_output

def run_validation(creative_brief, persona_profile, opportunity_result, wireframe_result):
    crew_val = Crew(agents=[validation_agent], tasks=[validation_task], process=Process.sequential, verbose=True)
    crew_val.kickoff(inputs={
    "creative_brief": creative_brief,
    "persona_profile": persona_profile,
    "opportunity_result": opportunity_result,
    "wireframe_result": wireframe_result,
    })
    with open(VALIDATION_REPORT_PATH) as f:
        validation_report = f.read().strip()
    # Human-in-the-loop revision:
    while True:
        print(validation_report)
        feedback = input("Enter feedback for the validation report, or press Enter to accept:\n").strip()
        if not feedback:
            break
        revise_prompt = f"Please update the validation report to address this feedback: '{feedback}'\n\nOriginal Report:\n{validation_report}"
        validation_report = answer(revise_prompt).strip()
    with open(VALIDATION_REPORT_PATH, 'w') as f:
        f.write(validation_report + '\n')
    print(f"✅ Validation report saved to {VALIDATION_REPORT_PATH}")
    return validation_report

def run_refinement(validation_report):
    crew_ref = Crew(agents=[refinement_agent], tasks=[refinement_task], process=Process.sequential, verbose=True)
    crew_ref.kickoff(inputs={
    "validation_report": validation_report,
    })
    with open(REFINEMENT_OUTPUT_PATH) as f:
        refinement_result = f.read().strip()
    return refinement_result

def run_user_stories(refinement_result, opportunity_result):
    crew_us = Crew(agents=[user_stories_agent], tasks=[user_stories_task], process=Process.sequential, verbose=True)
    crew_us.kickoff(inputs={
    "refinement_result": refinement_result,
    "opportunity_result": opportunity_result,
    })
    with open(USER_STORIES_OUTPUT_PATH) as f:
        user_stories = f.read().strip()
    return user_stories

def run_sprint_planning(user_stories, opportunity_result):
    crew_sp = Crew(agents=[sprint_planning_agent], tasks=[sprint_planning_task], process=Process.sequential, verbose=True)
    crew_sp.kickoff(inputs={
    "user_stories": user_stories,
    "opportunity_result": opportunity_result,
    })
    with open(SPRINT_PLANNING_OUTPUT_PATH) as f:
        sprint_plan = f.read().strip()
    return sprint_plan

def main(transcript):
    os.makedirs("output", exist_ok=True)
    # Phase 1: extractor + manual loop
    problem_statement = run_extractor(transcript)
    # Phase 2: brainstorming
    brainstorm_result = run_brainstorm(problem_statement)
    selected_concept, concept_num = select_concept(brainstorm_result)
    # print(f"Selected Concept: {concept_num} and Concept: {selected_concept}")
    # Phase 3: Prioritization agent
    prioritization_result = run_prioritization(selected_concept)
    # print(f"\n✅ Prioritization output written to {PRIORITIZATION_OUTPUT_PATH}\n")
    # Phase 4: Research agent
    research_brief = run_research(selected_concept, prioritization_result)
    # print(research_brief)
    # Phase 5: Persona agent
    user_domain = str(input("Enter the domain/industry: "))
    persona_profile = run_persona(selected_concept, prioritization_result, research_brief, problem_statement, user_domain)
    # print(persona_profile)
    # Phase 6: Opportunity Mapper agent
    opportunity_result = run_opportunity_mapper(persona_profile, research_brief, prioritization_result)
    # print(opportunity_result)
    # Phase 7: Inspiration agent
    inspiration_result = run_inspiration(selected_concept, persona_profile)
    # print(inspiration_result)
    # Phase 8: Creative Brief agent
    creative_brief = run_creative_brief(problem_statement, selected_concept, persona_profile, prioritization_result, research_brief, inspiration_result, opportunity_result)
    # print(creative_brief)
    # Phase 9: Wireframe agent
    wireframe_result = run_wireframe(creative_brief, persona_profile)
    # print(wireframe_result)
    # Phase 10: Validation agent
    validation_result = run_validation(creative_brief, persona_profile, opportunity_result, wireframe_result)
    # print(validation_result)
    # Phase 11: Refinement agent
    refinement_result = run_refinement(validation_result)
    # print(refinement_result)
    # Phase 12: User Stories agent
    user_stories = run_user_stories(refinement_result, opportunity_result)
    # print(user_stories)
    # Phase 13: Sprint Planning agent
    sprint_plan = run_sprint_planning(user_stories, opportunity_result)
    print("\n\n\n", sprint_plan, "\n\n\n")


if __name__ == "__main__":
    main(transcript1)