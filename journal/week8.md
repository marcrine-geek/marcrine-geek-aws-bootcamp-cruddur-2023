# Week 8 — Serverless Image Processing

- CDK setup
- install cdk using the below command in ubuntu linux terminal
```
npm install -g aws-cdk
```
![This](/screenshots/serverless/cdksetup.png)

- initialize cdk using the `cdk init` command

![This](/screenshots/serverless/cdkinit.png)

- After updating your files with the resources to be deployed then use `cdk synth` to checkout the plan and scan for any errors
![This](/screenshots/serverless/cdksynth.png)

- creating a cloudfront distribution to serve avatars
![This](/screenshots/serverless/cloudfront.png)

- cdk synth the new updates
![This](/screenshots/serverless/synth2.png)

![This](/screenshots/serverless/synth3.png)

- deploy the updates using `cdk deploy` command
![This](/screenshots/serverless/deploy.png)

![This](/screenshots/serverless/lambda.png)

![This](/screenshots/serverless/stacks.png)

![This](/screenshots/serverless/sns.png)

![This](/screenshots/serverless/buckets.png)
