## AWS Amplify Vue.js Starter Template

This repository provides a starter template for creating applications using Vue.js and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This application demonstrates how to use Amplify to handle auth, appsync, and call backend lambda functions. This application has been secured via Amplify auth and is able to call the Amazon Bedrock Api and Google Gemini API. 

## Installation Steps
git clone {repo} {directory}
cd {directory}
npm install

npx ampx sandbox 
npm ampx sandbox add API_KEY // Google Gemini API Key
npm run dev

## Secrets Needed
API_KEY = GOOGLE_GEMINI_API_KEY

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

## Action Items: 
- [x] Get Google API calls working. 
- [x] Add reactivity. 
- [x] Pass different prompts to Google LLMs and diplay the results.
- [x] Get Bedrock API calls working. 
- [x] Have two buttons able to get responses differently. 
- [x] Update Bedrock API to pass the given prompt and respond to properly. 
- [x] Pick a common pattern for arranging functions.
- [x] Secure the application to only support logged in users. 
- [ ] Save a secured template
- [ ] Add python lambda
- [ ] Image upload and analysis
- [ ] Save a template with python image analsis
- [ ] Upload file for analysis and Rag
- [ ] Save a Rag-enabled analysis template
- [ ] Exportable CDK backend
- [ ] Get Anthropic API calls working without API_KEY rather than via Bedrock.
- [ ] Modify the Bedrock API to allow you to select the model in the GUI and pass it to Bedrock. 
- [ ] Provide a selection of Google models to choose from. 
- [ ] Add support to keep track of the number of tokens used per user.  
- [ ] Add a buttons to allow switching between 3 different website styles for comparison. 
- [ ] Use other LLMs to draft the readme and product planss to start. fro demos. 


- [ ] More Amplify demos with additional features
- [ ] More Bedrock examples
- [ ] More examples from the Bedrock workshop




