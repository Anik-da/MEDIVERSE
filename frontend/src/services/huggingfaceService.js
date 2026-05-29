/**
 * Direct Hugging Face Client-Side Inference API Service
 * Provides client-side fallback connectivity to public medical AI models
 * if the local FastAPI backend is unavailable or not running.
 * Implements a resilient model cascade beginning with Google Gemma 4.
 */

export async function queryHuggingFaceDirect(prompt, modelName = "google/gemma-4-E4B-it") {
  const modelsToTry = [modelName]
  const fallbacks = ["google/gemma-2-9b-it", "ruslanmv/Medical-Llama3-8B"]
  
  for (const f of fallbacks) {
    if (!modelsToTry.includes(f)) {
      modelsToTry.push(f)
    }
  }

  for (const currentModel of modelsToTry) {
    const url = `https://api-inference.huggingface.co/models/${currentModel}`
    const payload = {
      inputs: prompt,
      parameters: { max_new_tokens: 250, temperature: 0.7 }
    }

    try {
      console.log(`Querying Hugging Face model: ${currentModel}...`)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        mode: "cors"
      })

      if (response.ok) {
        const result = await response.json()
        let text = ""
        if (Array.isArray(result) && result.length > 0) {
          const item = result[0]
          if (item && typeof item === 'object') {
            text = item.generated_text || item.summary_text || ""
          } else if (typeof item === 'string') {
            text = item
          }
        } else if (result && typeof result === 'object') {
          text = result.generated_text || result.summary_text || ""
        }

        if (text) {
          console.log(`Successfully retrieved response from model: ${currentModel}`)
          return text
        }
      } else {
        console.warn(`HF model ${currentModel} returned status ${response.status}. Trying next cascade option...`)
      }
    } catch (err) {
      console.warn(`Failed query for model ${currentModel}:`, err)
    }
  }
  return ""
}
