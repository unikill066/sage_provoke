from crewai import Agent, LLM
from crewai_tools import SerperDevTool
from prompts.inspiration_prompt_7 import INSPIRATION_AGENT_PROMPT

serper_tool = SerperDevTool(n_results=5)

llm = LLM(model="openai/gpt-4", temperature=0.5)

inspiration_agent = Agent(
    role="Inspiration Agent",
    goal=(
        "Pull annotated Product/UI/UX examples and pattern libraries from top products, "
        "and build a visual inspiration board tied to the concept and persona."
    ),
    backstory=(
        "You’re a senior product designer who curates best-in-class UI patterns and annotates why they work, "
        "with a focus on accessibility and micro-interactions."
    ),
    llm=llm,
    tools=[serper_tool],
    use_system_prompt=True,
    system_template=INSPIRATION_AGENT_PROMPT,
    verbose=True,
)