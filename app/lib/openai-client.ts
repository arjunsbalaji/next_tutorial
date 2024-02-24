
import { tree } from 'next/dist/build/templates/app-page';
import OpenAI from 'openai';


const openai = new OpenAI({apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser:true});

export async function fetchDocInfo(doctext: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "from the input below return a json that has title, description, subject, level, author keys that is summarised from the below text. " },
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


export async function makeDocNotes(doctext: string) {
const completion = await openai.chat.completions.create({
    messages: [
    { role: "system", content: "You are a high quality education partner for users of this app. You help people understand things by simplyfying knowledge, being truthful and accurate." },
    { role: "system", content: "From the input below return a set of notes that summarises the key points of the text. Return a json, with key text:....." },
    { role: "system", content: doctext }
    ],
    model: "gpt-3.5-turbo",
    response_format: { "type": "json_object" },
    //stream: true,
});

//for await (const chunk of completion)

const content = completion.choices[0].message.content;
if (typeof content === 'string') {
    return JSON.parse(content);
}


throw new Error('Invalid response format from OpenAI API');
}

