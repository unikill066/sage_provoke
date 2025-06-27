from crewai import Agent, LLM
from prompts.brainstorm_prompt_2 import BRAINSTORMING_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

brainstormer_agent = Agent(
    role="Idea Brainstormer",
    goal="Generate multiple UX/product solution concepts with pros, cons, feasibility, dependencies, and success metrics",
    backstory=(
        "You’re a seasoned product strategist and UX designer: given a clear problem statement, "
        "you propose high-impact ideas that balance user delight, technical feasibility, and business goals."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=BRAINSTORMING_PROMPT,
    verbose=True
)