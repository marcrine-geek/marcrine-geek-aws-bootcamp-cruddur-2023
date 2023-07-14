# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

### Create a CodePipeline in AWS as shown in the steps below

- First you will be prompted to connect to your github account
- Note: Make sure you have a github account and some repositories with code ... 

![This](/screenshots/cicd/coongit.png)

- Next select the branch you want to trigger the pipeline when source code changes
![This](/screenshots/cicd/gitconn.png)

- Add a deploy stage, and in our case our deployment stage is in the ECS cluster using docker containers
- Make sure you have an ECS cluster, with services and tasks definitions.
- You also need to have an ECR where the docker images are stored
![This](/screenshots/cicd/ecs.png)

- After the above steps, now review your configurations.
![This](/screenshots/cicd/pipelinerv.png)

![This](/screenshots/cicd/deploystg.png)

- The last step is to create the pipeline
- The below image shows that the pipeline is running
![This](/screenshots/cicd/pipesucc.png)

- Create a build stage using code build

![This](/screenshots/cicd/addbuild.png)

![This](/screenshots/cicd/codebuild.png)
