/**
 * Direct Hugging Face Client-Side Inference API Service
 * Provides client-side fallback connectivity to public medical AI models
 * if the local FastAPI backend is unavailable or not running.
 */

export async function queryHuggingFaceDirect(prompt, modelName = "ruslanmv/Medical-Llama3-8B") {
  const url = `https://api-inference.huggingface.co/models/${modelName}`;
  const payload = {
    inputs: prompt,
    parameters: { max_new_tokens: 250, temperature: 0.7 }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      mode: "cors"
    });

    if (response.ok) {
      const result = await response.json();
      if (Array.isArray(result) && result.length > 0) {
        const item = result[0];
        if (item && typeof item === 'object') {
          if (item.generated_text) return item.generated_text;
          if (item.summary_text) return item.summary_text;
        } else if (typeof item === 'string') {
          return item;
        }
      } else if (result && typeof result === 'object') {
        if (result.generated_text) return result.generated_text;
        if (result.summary_text) return result.summary_text;
      }
    } else {
      console.warn(`Direct HF response status: ${response.status}`);
    }
  } catch (err) {
    console.warn("Direct client-side HuggingFace inference query failed:", err);
  }
  return "";
}
