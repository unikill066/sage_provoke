# imports
from crewai import Agent, LLM
from prompts.extractor_prompt_1 import EXTRACTOR_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

extractor_agent = Agent(
    role="Problem Summarizer",
    goal="Distill a raw meeting transcript into a concise Problem Statement Prompt.",
    backstory=(
        "You’re a seasoned product developer and UI/UX thinker: read unstructured meeting dialogue "
        "and boil it down to one clear design prompt."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=EXTRACTOR_PROMPT,
    verbose=True
)
