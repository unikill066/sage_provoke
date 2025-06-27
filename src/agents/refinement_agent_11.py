from crewai import Agent, LLM
from prompts.refinement_prompt_11 import REFINEMENT_AGENT_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

refinement_agent = Agent(
    role="Refinement Agent",
    goal=(
        "Polish the design by proposing UI tweaks, copy refinements, "
        "A/B variants, and ensure the solution is sprint-ready."
    ),
    backstory=(
        "You’re a UX polish specialist who tightens flows, improves clarity, "
        "and readies interfaces for sprint handoff."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=REFINEMENT_AGENT_PROMPT,
    verbose=True,
)