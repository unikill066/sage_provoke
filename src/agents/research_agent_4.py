from crewai import Agent, LLM
from crewai_tools import SerperDevTool
from prompts.research_prompt_4 import RESEARCH_AGENT_PROMPT

serper_tool = SerperDevTool(n_results=5)

llm = LLM(model="openai/gpt-4", temperature=0.5)

research_agent = Agent(
    role="Research Agent",
    goal=(
        "Gather competitor Product and UI/UX patterns, user reviews, accessibility risks, "
        "and best practices for a given concept, then summarize into a research brief."
    ),
    backstory=(
        "You’re an expert product researcher specializing in competitor analysis and accessibility. "
        "Use live web searches to collect data and distill it into actionable insights."
    ),
    llm=llm,
    tools=[serper_tool],
    use_system_prompt=True,
    system_template=RESEARCH_AGENT_PROMPT,
    verbose=True,
)