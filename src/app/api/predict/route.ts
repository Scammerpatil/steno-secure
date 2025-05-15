import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildGeminiPrompt(data: any, prediction: number) {
  return `
You are a financial assistant. Based on the user’s loan application data and prediction result, give:
1. A list of 4-5 key factors affecting their approval chances. Each factor should have:
   - label
   - value
   - sentiment: Positive | Neutral | Negative 

    - a short explanation of why this factor is important for loan approval.

    - Example: * Credit Score: 700 (Positive) - A higher credit score indicates a lower risk for lenders.

    - Give the factors in a json array format.
    - Example: [{ "label": "Credit Score", "value": "700", "sentiment": "Positive", "explanation": "A higher credit score indicates a lower risk for lenders." }]
    - Do not include any other text or explanation, just the json array.
    - This will help to parse the response easily.

2. A recommendation for the user based on the prediction result. It should be a breif summary of the factors and a suggestion for the user to improve their chances of approval.
   - Recommendation: "Based on the factors, we recommend you to improve your credit score and reduce your debt-to-income ratio to increase your chances of approval."
   - Do not include any other text or explanation, just the recommendation.
   
User Data:
${JSON.stringify(data, null, 2)}

Model Prediction: ${prediction === 1 ? "Approved" : "Rejected"}
`;
}

function parseGeminiResponse(responseText: string) {
  let recommendation = "";
  recommendation = responseText.split("Recommendation:")[1]?.trim() || "";
  const rawFactors = responseText.slice(
    responseText.indexOf("[") - 1,
    responseText.indexOf("]") + 1
  );
  const factors = JSON.parse(rawFactors);
  try {
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
  }

  return { factors, recommendation };
}

export async function POST(req: NextRequest) {
  const formData = await req.json();
  console.log("Received data:", formData);
  try {
    const flaskRes = await fetch(
      "https://novacops.pythonanywhere.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (!flaskRes.ok) {
      const err = await flaskRes.json();
      return NextResponse.json(
        { error: err.message || "Flask error" },
        { status: flaskRes.status }
      );
    }

    const flaskData = await flaskRes.json();

    const prompt = buildGeminiPrompt(formData, flaskData.prediction);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    try {
      const { factors, recommendation } = parseGeminiResponse(text);
      return NextResponse.json({
        prediction: flaskData.prediction,
        confidence: flaskData.confidence,
        factors,
        recommendation,
      });
    } catch (error) {
      console.error("Parsing error:", error);
      return NextResponse.json(
        { error: "Failed to parse Gemini response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
