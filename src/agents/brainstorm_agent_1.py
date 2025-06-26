"""
Developer: Nikhil (GitHub: unikill066)
Date: 2025-06-26
"""

from crewai import Agent, LLM
from prompts.prompts import BRAIN_STORM_SYSTEM_PROMPT

# 1) Your LLM
llm = LLM(model="openai/gpt-4", temperature=0.3)

# 3) Instantiate the Agent with your XML system prompt
extractor_agent = Agent(
    role="Meeting Transcript Task & Idea Extractor",
    goal=(
        "Carefully read a meeting transcript input and output two lists: "
        "tasks & action items, and ideas & suggestions."
    ),
    backstory=(
        "You excel at parsing unstructured text to find what needs to get done "
        "and what new ideas emerged."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=BRAIN_STORM_SYSTEM_PROMPT,
    verbose=True
)
