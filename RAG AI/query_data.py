import argparse
from langchain.vectorstores.chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama

from get_embedding_function import get_embedding_function


import os

from groq import Groq


CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""
import os
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

client = Groq(
    api_key=GROQ_API_KEY
)






def main():
    # Create CLI.
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text
    query_rag(query_text)


def query_rag(query_text: str):
    # Prepare the DB.

    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([
    doc.page_content.replace("\n", " ").strip() for doc, _ in results
    ])

    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)


 
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt},
                {"role": "system", "content": "You are a helpful assistant, answer based on the context only."},
            ],
            model="llama-3.3-70b-versatile",
            max_completion_tokens=1024,
            top_p=1,
        )
        response = chat_completion.choices[0].message.content
        print(response)
    except Exception as e:
        print(f"Error occurred: {e}")
        return "An error occurred while processing your request."


if __name__ == "__main__":
    main()
