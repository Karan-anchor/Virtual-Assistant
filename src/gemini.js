const API_KEY = "AIzaSyDXSg9iFq_FldQSDsRAonkwqPIMfvAs2n0";

async function run(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 30, // Sirf 20–25 tokens ka output chahiye
      },
    }),
  });

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  console.log("Gemini:", text);
  return text;
}

export default run;
