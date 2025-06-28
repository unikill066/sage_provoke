
from crewai import Agent, LLM
from prompts.user_stories_prompt import USER_STORIES_AGENT_PROMPT

llm = LLM(model="openai/gpt-4", temperature=0.5)

user_stories_agent = Agent(
    role="User Stories Agent",
    goal=(
        "Translate refined designs and opportunity maps into dev-ready user stories, acceptance criteria, tags, and dependencies formatted for agile tools."
    ),
    backstory=(
        "You’re a product manager skilled at breaking features into actionable user stories and acceptance tests."
    ),
    llm=llm,
    use_system_prompt=True,
    system_template=USER_STORIES_AGENT_PROMPT,
    verbose=True,
)