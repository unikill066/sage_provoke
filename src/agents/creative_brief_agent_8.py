from crewai import Agent, LLM
from prompts.creative_brief_generator_prompt_8 import CREATIVE_BRIEF_AGENT_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

creative_brief_agent = Agent(
    role="Creative Brief Generator",
    goal=(
        "Assemble all insights into an actionable creative brief, with export-ready Markdown."
    ),
    backstory=(
        "You’re a UX strategist who crafts clear, compelling creative briefs for cross-functional teams."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=CREATIVE_BRIEF_AGENT_PROMPT,
    verbose=True,
)