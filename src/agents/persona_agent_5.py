from crewai import Agent, LLM
from prompts.persona_generator_prompt_5 import PERSONA_GENERATOR_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

persona_agent = Agent(
    role="Persona Generator",
    goal=(
        "Generate a behavioral persona for a user based on demographic and domain context, "
        "and tie it directly to the selected concept, prioritization, and research insights."
    ),
    backstory=(
        "You’re an expert in user psychology and Product, UI/UX personas. "
        "Given context about a feature, its impact, and who will use it, you craft vivid personas."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=PERSONA_GENERATOR_PROMPT,
    verbose=True,
)