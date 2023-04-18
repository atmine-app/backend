const axios = require("axios");

async function summarizeText(text) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not configured, please follow instructions in README.md"
    );
  }

  const prompt = generatePromptSummary(text);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        prompt: prompt,
        max_tokens: 50,
        stop: null,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error.message);

    if (error.response) {
      console.error(
        "OpenAI API Response:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("An error occurred during your request.");
    }

    throw error;
  }
}

function generatePromptSummary(description) {
  return `You are given this text that is the description of a property, i want you to summarize it in less than 20 words: ${description}
`;
}

module.exports = {
  summarizeText,
};
