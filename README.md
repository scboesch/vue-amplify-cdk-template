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
- [x] Add support for CDK resoruces and ensure those resources can be accessed from the Amplify stack. 
- [x] Pass SQS URL to lambda function via env parameters. 
- [x] Create a CDK lambda function that monitors the SQS queue. 
- [ ] Enqueue into a stack's exposed SQS queue. Currently, you don't know how to export the queueURL to use it. 
- [ ] Call a lambda function exposed by a stack. 
- [ ] Be able to build GUIs that can call lambda functions and sqs queues exposed by stacks. 

Functions in the Amplify stack can be streamed back to the console. 
Functions in other stacks, will not return logs. 
It may make sense to try calling functions to see the responses. 

It is possible to create a lambda function to monitor the SQS queue when the new lambda function is included in the backend. We can enqueue from sayHello and dequeue from processQueue. We can not enable triggers to monitor SQS queues from outside the stack.



https://docs.amplify.aws/react/build-a-backend/add-aws-services/custom-resources/


It is supposed to be possible to let functions access the API but I had allow issues when trying initially. 
https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/

This example supposedly implements putting policies into a differnt stack to avoid the circular refernce. 
https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/






