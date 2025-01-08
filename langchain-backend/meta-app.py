from flask import Flask, request, jsonify
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import HuggingFaceLLM

from dotenv import load_dotenv
import os
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = Flask(__name__)

CORS(app)

load_dotenv()  # Load environment variables from .env file
llama_model_name = "meta-llama/Llama-2-7b-hf"  # Model name in Hugging Face

# Load the LLaMA model and tokenizer using Hugging Face's transformers
tokenizer = AutoTokenizer.from_pretrained(llama_model_name)
model = AutoModelForCausalLM.from_pretrained(llama_model_name)

# Device configuration (if using a GPU, otherwise it defaults to CPU)
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def generate_text(prompt):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(inputs['input_ids'], max_length=512, num_return_sequences=1)
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_text

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    analytics_data = data.get('averages', {})

    # Prepare the post type data for comparison
    selected_post_type = analytics_data.get('selected', {})
    other_post_types = {key: value for key, value in analytics_data.items() if key != 'selected'}

    # Prepare prompt for LangChain to analyze the entire data
    prompt_template = PromptTemplate(
        input_variables=["analytics_data", "selected_post_type", "other_post_types"],
        template=(
            "You are an analytics expert. You are given data about different types of posts on a platform. "
            "Provide a summary of insights about the entire data and compare the selected post type with the others. "
            "Here is the entire data: {analytics_data} "
            "Selected post type: {selected_post_type} "
            "Comparison with other types: {other_post_types}"
        )
    )
    chain = LLMChain(llm=HuggingFaceLLM(generate_text), prompt=prompt_template)

    # Generate insights and suggestions
    analytics_text = str(analytics_data)
    selected_text = str(selected_post_type)
    other_text = str(other_post_types)

    result = chain.run(analytics_data=analytics_text, selected_post_type=selected_text, other_post_types=other_text)

    return jsonify({"insights": result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
