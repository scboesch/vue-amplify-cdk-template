import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data} from './data/resource';
import { MODEL_ID, MODEL_IDs, generateHaikuFunction } from './functions/generate-haiku/resource';
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { sayHello } from './functions/say-hello/resource';
import { processQueueFunction } from './functions/process-queue/resource';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { CfnOutput } from 'aws-cdk-lib';


export const backend = defineBackend({
  auth,
  data,
  sayHello,
  generateHaikuFunction,
  processQueueFunction,
});

const customResourceStack = backend.createStack('MyCustomResources');

const customQueue = new sqs.Queue(customResourceStack, 'CustomQueue');
new sns.Topic(customResourceStack, 'CustomTopic');

new CfnOutput(customResourceStack, 'CustomQueueUrl', {
  value: customQueue.queueUrl,
  exportName: 'CustomQueueUrl',
});

// For some reason, addEnvironment is not found as available by typescript. 
// @ts-ignore
backend.sayHello.resources.lambda.addEnvironment('CUSTOM_QUEUE_URL', customQueue.queueUrl);

// Configure the processQueueFunctio
// @ts-ignoren
backend.processQueueFunction.resources.lambda.addEnvironment('QUEUE_URL', customQueue.queueUrl);
backend.processQueueFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['sqs:ReceiveMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes'],
    resources: [customQueue.queueArn],
  })
);

// Add SQS trigger to the processQueueFunction
backend.processQueueFunction.resources.lambda.addEventSource(new lambdaEventSources.SqsEventSource(customQueue));


backend.addOutput({
  custom: {
    CUSTOM_QUEUE_URL: customQueue.queueUrl,
  },
});

backend.sayHello.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['sqs:SendMessage'],
    resources: [customQueue.queueArn],
  })
);

// Will need to provide access to all supportable models. 
// Replace resources list with the full list of supported models. 
let theResources = [];
for (var the_model_id of MODEL_IDs) {
  let nextModel = `arn:aws:bedrock:*::foundation-model/${MODEL_ID}`
  theResources.push(nextModel);
}
//console.log(theResources);

backend.generateHaikuFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: theResources,
    //resources: [  `arn:aws:bedrock:*::foundation-model/${MODEL_ID}`,],
  })
);
