from crewai import Agent, LLM
from crewai_tools import SerperDevTool
from prompts.prioritization_prompt_3 import PRIORITIZATION_AGENT_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

serper_tool = SerperDevTool(n_results=5)
# serper_tool = SerperDevTool(country="us", locale="en", location="United States", n_results=3)

prioritization_agent = Agent(
    role="Prioritization Agent",
    goal=(
        "Rank and prioritize a set of product concepts based on feasibility and ROI, "
        "flag fast wins and high-risk bets, and recommend the top concept."
    ),
    backstory=(
        "You’re a product strategist with experience in ROI analysis and agile delivery. "
        "Given a shortlist of concepts, you objectively assess trade-offs and champion "
        "the most impactful direction."
    ),
    llm=llm,
    tools=[serper_tool],
    use_system_prompt=True,
    system_template=PRIORITIZATION_AGENT_PROMPT,
    verbose=True,
)
