import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data} from './data/resource';
import { MODEL_ID, MODEL_IDs, generateHaikuFunction } from './functions/generate-haiku/resource';
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { sayHello } from './functions/say-hello/resource';
import { processQueueFunction } from './functions/process-queue/resource';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { CfnOutput } from 'aws-cdk-lib';


export const backend = defineBackend({
  auth,
  data,
  sayHello,
  generateHaikuFunction,
  processQueueFunction,
});

/*
  Any resources that will be accessing Amplify resources need to be defined outside of the Amplify stack to avoid circular references. 
*/

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// Import the Lambda module

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const customQueue2 = new sqs.Queue(this, 'CustomQueue2');
    // Define the Lambda function resource
    const myFunction = new lambda.Function(this, "HelloWorldFunction", {
      runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log(JSON.stringify(event, null, 2));
          return {
            statusCode: 200,
            body: JSON.stringify('Hello World!'),
          };
        };
      `),
    });
    // Add an SQS Event Source from the SQS Queue to the Lambda Function
    const eventSource = new lambdaEventSources.SqsEventSource(customQueue2);

    myFunction.addEventSource(eventSource);
    new CfnOutput(this, 'CustomQueueUrl2', {
      value: customQueue2.queueUrl,
      exportName: 'HelloLambdaQueueUrl',
    });
    new CfnOutput(this, 'LambdaFunctionArn', {
      value: myFunction.functionArn,
      exportName: 'HelloLambdaFunctionArn',
    });
    new CfnOutput(this, 'LambdaFunctionName', {
      value: myFunction.functionName,
      exportName: 'HelloLambdaFunctionName',
    });

  }
}

const customNotifications = new HelloCdkStack (
  backend.createStack('HelloCdkStack'),
  'HelloCdkStack'
);


const customResourceStack = backend.createStack('MyCustomResources');

const customQueue = new sqs.Queue(customResourceStack, 'CustomQueue');

new CfnOutput(customResourceStack, 'CustomQueueUrl', {
  value: customQueue.queueUrl,
  exportName: 'CustomQueueUrl',
});

    // Create a new Lambda Function
    const lambdaFunction = new lambda.Function(customResourceStack, 'Function', {
      code: lambda.Code.fromAsset('./amplify/functions/event-processor'),
      handler: 'handler.handler',
      functionName: 'SqsMessageHandler',
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    // Add an SQS Event Source from the SQS Queue to the Lambda Function
    const eventSource = new lambdaEventSources.SqsEventSource(customQueue);

    lambdaFunction.addEventSource(eventSource);

/*
We want to be able to have stacks expose their lambda functions and queues. 
Then we can call the lambda functions from the Amplify stack to see results locally. 
We can also create step-functions stacks to chain lambda functions together. 

*/ 


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
