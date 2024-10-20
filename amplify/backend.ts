import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data} from './data/resource';
import { MODEL_ID, MODEL_IDs, generateHaikuFunction } from './functions/generate-haiku/resource';
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { sayHello } from './functions/say-hello/resource';

export const backend = defineBackend({
  auth,
  data,
  sayHello,
  generateHaikuFunction,
});

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
