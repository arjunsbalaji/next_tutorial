import OpenAI from "openai";
import {  ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI();

class Course {
    doc_list: string[];
    user_profile: Record<string, any>;
    feed_prompt: string;
    oai: OpenAI;
    heading_prompt: string;
    learning_outcomes!: string | null;
  
    constructor(doc_list: any[], user_profile: Record<string, any>, prompt: string) {
      this.doc_list = doc_list;
      this.user_profile = user_profile;
      this.feed_prompt = prompt;
      this.oai = new OpenAI();
      this.heading_prompt = 'You are a realtime education assistant. You help people learn things they care about by uilding structured courses for them based on learning resources they provide you. You try to understand the user, their preferences and needs, to help them learn the best. They will provide you with a prompt that explains what structure they want, and you will also be provided with their profile. Go slow. Think step by step.';
    }
  
    async make_learning_outcomes() {
      const learning_outcomes = await openai.chat.completions.create({
        model: 'gpt-4',
        stream: false,
        messages: [
          {role: 'system', content: this.heading_prompt},
          {role: 'system', content: 'The users prompt for this course is:' + this.feed_prompt},
          {role: 'system', content: 'Generate a set out learning outcomes based on the provided user prefrences for the document provided. Your answer should be a list of strings only that start with a number then a . , and should not include any extra text.'},
          ...this.doc_list.map(doc => ({role: 'user', content: doc}))
        ] as ChatCompletionMessageParam[]
      });
    
      this.learning_outcomes = learning_outcomes['choices'][0].message.content;
      // console.log(this.learning_outcomes);
    }
  
    // Add the timeline method here
  }