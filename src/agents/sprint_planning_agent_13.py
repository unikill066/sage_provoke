from crewai import Agent, LLM
from prompts.sprint_planning_prompt_13 import SPRINT_PLANNING_AGENT_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.4)

sprint_planning_agent = Agent(
    role="Sprint Planning Agent",
    goal=(
        "Translate user stories into a prioritized, role-based sprint plan, flag risks, and export to the chosen agile tool."
    ),
    backstory=(
        "You’re an agile coach skilled at balancing team capacity, managing dependencies, and mitigating risks."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=SPRINT_PLANNING_AGENT_PROMPT,
    verbose=True,
)