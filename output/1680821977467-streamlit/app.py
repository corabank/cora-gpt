# import required libraries
import streamlit as st
import openai
import os

# load environment variables
from dotenv import load_dotenv
load_dotenv()

# initialize openai api key
api_key = os.getenv('OPENAI_API_KEY')
openai.api_key = api_key

# define function to generate image using OpenAI Image API
@st.cache(allow_output_mutation=True)
def generate_image(prompt):
    response = openai.Image.create(
              prompt=prompt,
              n=1,
              size="512x512"
              )
    return response['data'][0]['url']

# set up tabs
tabs = {"Human in the loop": "HITL", "Bootstrap code and standardisation": "Bootstrap Code", "Democratisation of LLM within engineering team": "Democratisation LLM"}

# create streamlit app
st.set_page_config(page_title="OpenAI Image Generator", page_icon=":memo:")
st.title("OpenAI Image Generator")

# add tabs
tab = st.sidebar.selectbox("Use Case Selection", options=list(tabs.keys()))

if tab == "Human in the loop":
    st.header("Human in the loop")
    st.write("Human in the loop refers to the collaboration between humans and machines, where the machine automates repetitive or manual tasks, and humans are responsible for supervising or handling exceptions. This approach is especially useful in fields like healthcare, where a human touch is required while performing highly repetitive tasks. Use the prompt below to generate an image explaining HITL in detail.")
    # get user input
    prompt = st.text_input("Prompt", value="Human in the loop")
    if prompt:
        try:
            image_url = generate_image(prompt)
            st.image(image_url, width=512)
        except Exception as e:
            st.error("Failed to generate image. Please try with a different prompt.")

elif tab == "Bootstrap code and standardisation":
    st.header("Bootstrap code and standardisation")
    st.write("Bootstrap code is a set of code snippets that is applied to a project to set it up quickly with the necessary functionality. Standardisation on the other hand involves applying consistent coding styles or standards across a codebase. These practices save time and help maintain a high level of quality in software development. Use the prompt below to generate an image explaining Bootstrap code and standardisation in detail.")
    # get user input
    prompt = st.text_input("Prompt", value="Bootstrap code and standardisation")
    if prompt:
        try:
            image_url = generate_image(prompt)
            st.image(image_url, width=512)
        except Exception as e:
            st.error("Failed to generate image. Please try with a different prompt.")

else:
    st.header("Democratisation of LLM within engineering team")
    st.write("Democratisation of LLM within engineering team refers to the process of making Language Model (LM) usage accessible to all members of an engineering team, regardless of their expertise level. This is done by creating workflows and tools that allow for easy model training and deployment. Use the prompt below to generate an image explaining Democratisation of LLM within engineering team in detail.")
    # get user input
    prompt = st.text_input("Prompt", value="Democratisation of LLM within engineering team")
    if prompt:
        try:
            image_url = generate_image(prompt)
            st.image(image_url, width=512)
        except Exception as e:
            st.error("Failed to generate image. Please try with a different prompt.")
