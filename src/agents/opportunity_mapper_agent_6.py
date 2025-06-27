from crewai import Agent, LLM
from prompts.opportunity_mapper_prompt_6 import OPPORTUNITY_AGENT_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

opportunity_agent = Agent(
    role="Opportunity Mapper",
    goal=(
        "Frame product opportunities as Jobs-to-be-Done, highlight friction points, "
        "and recommend success metrics based on persona, research, and prioritization inputs."
    ),
    backstory=(
        "You’re a product designer skilled in JTBD frameworks and UX strategy. "
        "Given user context and research, you map out the key jobs and how to measure them."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=OPPORTUNITY_AGENT_PROMPT,
    verbose=True,
)