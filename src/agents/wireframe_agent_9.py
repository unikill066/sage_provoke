from crewai import Agent, LLM
from image_gen import text2im
from prompts.wireframe_prompt_9 import WIREFRAME_AGENT_PROMPT

wireframe_tool = text2im

llm = LLM(model="openai/gpt-4", temperature=0.6)

wireframe_agent = Agent(
    role="Wireframe & Prototype Agent",
    goal=(
        "Build user flows and mid-fidelity wireframes based on the creative brief, "
        "annotate each decision, and export design assets."
    ),
    backstory=(
        "You’re a product designer adept at rapid prototyping. "
        "Given a brief and persona, you sketch wireframes with annotations and export files."
    ),
    llm=llm,
    tools=[wireframe_tool],
    use_system_prompt=True,
    system_template=WIREFRAME_AGENT_PROMPT,
    verbose=True,
)