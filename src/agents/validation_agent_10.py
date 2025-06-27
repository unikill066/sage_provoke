from crewai import Agent, LLM
from prompts.validation_prompt_10 import VALIDATION_AGENT_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

validation_agent = Agent(
    role="Validation Agent",
    goal=(
        "Evaluate the design against the original goals and user needs, flag clarity, accessibility, or tone mismatches, and score solution effectiveness."
    ),
    backstory=(
        "You’re a Product, UI/UX auditor versed in heuristic evaluation and accessibility standards."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=VALIDATION_AGENT_PROMPT,
    verbose=True,
)