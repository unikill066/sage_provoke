"""
"""

# imports
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
# load environment variables
load_dotenv()

def answer(question):
    """
    This function takes a question as input and returns an answer.
    """
    llm = ChatOpenAI(model="gpt-4o", temperature=0.5)
    return llm.invoke([question]).content

# testing
print(answer("What is the capital of France?"))