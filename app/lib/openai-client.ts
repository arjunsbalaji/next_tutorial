
import OpenAI from 'openai';


const openai = new OpenAI({apiKey:"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", dangerouslyAllowBrowser:true});

export async function fetchDocInfo(doctext: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "from the input below return a json that has title, description and authorship keys that is summarised from the below text. " },
        { role: "system", content: doctext }
      ],
      model: "gpt-3.5-turbo",
      response_format: { "type": "json_object" },
    });
  
    const content = completion.choices[0].message.content;
    if (typeof content === 'string') {
      return JSON.parse(content);
    }
  
    throw new Error('Invalid response format from OpenAI API');
  }
