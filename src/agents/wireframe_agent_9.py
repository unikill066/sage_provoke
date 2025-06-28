from crewai import Agent, LLM
from prompts.wireframe_prompt_9 import WIREFRAME_AGENT_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.6)

wireframe_agent = Agent(
    role="Wireframe & Prototype Agent",
    goal=(
        "Define user flows and generate developer-friendly text-based wireframe specs "
        "from the creative brief and persona, annotate design decisions, "
        "and provide placeholders for Figma components and design tokens."
    ),
    backstory=(
        "You’re a UX designer skilled in creating clear wireframe specifications. "
        "Given a brief and persona, you map out screens as text specs ready for design tools."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=WIREFRAME_AGENT_PROMPT,
    verbose=True,
)



# # imports
# from crewai import Agent, LLM
# from prompts.wireframe_prompt_9 import WIREFRAME_AGENT_PROMPT
# from crewai_tools import DallETool


# llm = LLM(model="openai/gpt-4", temperature=0.5)

# # Instantiate the DALL-E tool for wireframe generation using DALL·E 3
# # DallETool will return URLs to generated sketches
# dalle_tool = DallETool(
#     model="dall-e-3",
#     size="512x512",
#     n=1,
# )

# # Define the Wireframe & Prototype Agent, now using DALL-E for sketching
# wireframe_agent = Agent(
#     role="Wireframe & Prototype Agent",
#     goal=(
#         "Build user journeys and mid-fidelity wireframes based on the creative brief, "
#         "annotate each design decision, and provide exportable assets."
#     ),
#     backstory=(
#         "You’re a UX designer specializing in rapid prototyping. "
#         "Given a creative brief and persona, you generate annotated wireframe sketches and design tokens."
#     ),
#     llm=llm,
#     tools=[dalle_tool],       # attach the DallE tool for image generation
#     use_system_prompt=True,
#     system_template=WIREFRAME_AGENT_PROMPT,
#     verbose=True,
# )




# from crewai import Agent, LLM
# # from image_gen import text2im
# from prompts.wireframe_prompt_9 import WIREFRAME_AGENT_PROMPT

# # wireframe_tool = text2im

# llm = LLM(model="openai/gpt-4", temperature=0.5)

# wireframe_agent = Agent(
#     role="Wireframe & Prototype Agent",
#     goal=(
#         "Build user flows and mid-fidelity wireframes based on the creative brief, "
#         "annotate each decision, and export design assets."
#     ),
#     backstory=(
#         "You’re a product designer adept at rapid prototyping. "
#         "Given a brief and persona, you sketch wireframes with annotations and export files."
#     ),
#     llm=llm,
#     tools=["text2im"],
#     use_system_prompt=True,
#     system_template=WIREFRAME_AGENT_PROMPT,
#     verbose=True,
# )