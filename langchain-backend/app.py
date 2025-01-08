from transformers import GPT2LMHeadModel, GPT2Tokenizer
from langchain.llms import BaseLLM  # Import the correct base class from LangChain
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Custom HuggingFaceGPT2 class implementing BaseLLM
class HuggingFaceGPT2(BaseLLM):
    def __init__(self, model_name: str = "gpt2", tokenizer_name: str = "gpt2"):
        super().__init__()

        # Initialize the model and tokenizer using Hugging Face's from_pretrained method
        self.model_name = model_name
        self.tokenizer_name = tokenizer_name
        self.model = None
        self.tokenizer = None

    def load_model(self):
        if self.model is None:
            self.model = GPT2LMHeadModel.from_pretrained(self.model_name)
            self.tokenizer = GPT2Tokenizer.from_pretrained(self.tokenizer_name)

    def _generate(self, prompt: str) -> str:
        # Ensure the model is loaded
        self.load_model()
        
        # Tokenize the input prompt
        inputs = self.tokenizer.encode(prompt, return_tensors="pt")
        
        # Generate text using the model
        outputs = self.model.generate(inputs, max_length=200, num_return_sequences=1)
        
        # Decode the generated tokens back into text
        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        return generated_text

    def _llm_type(self) -> str:
        # Define the type of LLM
        return "huggingface"

    def _call(self, prompt: str) -> str:
        # This is the method used to call the model in LangChain's LLMChain
        return self._generate(prompt)

    def _arun(self, prompt: str) -> str:
        # _arun is used for asynchronous execution (optional, but required for some cases)
        return self._generate(prompt)

    def __call__(self, prompt: str):
        # This method allows HuggingFaceGPT2 to be used in LLMChain
        return self._generate(prompt)

# Flask App Setup
app = Flask(__name__)
CORS(app)

load_dotenv()  # Load environment variables from .env file

# Initialize HuggingFaceGPT2 with model and tokenizer
llm = HuggingFaceGPT2(model_name="gpt2", tokenizer_name="gpt2")

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
    
    # Create a LangChain LLMChain
    chain = LLMChain(llm=llm, prompt=prompt_template)

    # Convert the data to strings
    analytics_text = str(analytics_data)
    selected_text = str(selected_post_type)
    other_text = str(other_post_types)

    # Generate insights and suggestions
    result = chain.run(analytics_data=analytics_text, selected_post_type=selected_text, other_post_types=other_text)

    return jsonify({"insights": result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
