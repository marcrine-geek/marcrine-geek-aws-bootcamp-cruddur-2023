# Week 6 — Deploying Containers

## Testing server connection
![This](/screenshots/containers/testingconn.png)

## Health checks
![This](/screenshots/containers/health-check.png)

## Creating system manager parameter store

![This](/screenshots/containers/params.png)

## Creating roles and policies

![This](/screenshots/containers/policy.png)

![This](/screenshots/containers/role.png)

## Deploying the backend-flask application to ECS

### steps
- Create an ecs cluster
```
aws ecs create-cluster \
--cluster-name cruddur \
--service-connect-defaults namespace=cruddur
```
![This](/screenshots/containers/ecscluster.png)

![This](/screenshots/containers/cluster.png)

![This](/screenshots/containers/clusterove.png)

- Login to ECR from the terminal 
```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```

- Create an ECR repository for python image
```
aws ecr create-repository \
  --repository-name cruddur-python \
  --image-tag-mutability MUTABLE
```

- Tag the python image. Note the format of tagging, name should be same as the repository name

```
docker tag python:3.10-slim-buster $ECR_PYTHON_URL/cruddur-python:3.10-slim-buster
```
+ example
```
docker tag python:3.10-slim-buster 81xxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/cruddur-python:3.10-slim-buster
```

- Push the docker image to ECR repository
```
docker push 81xxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/cruddur-python:3.10-slim-buster
```

![This](/screenshots/containers/pythonrepo.png)

![This](/screenshots/containers/python.png)

![This](/screenshots/containers/repo.png)

- Create ECR repository for backend-flask
```
aws ecr create-repository \
  --repository-name backend-flask \
  --image-tag-mutability MUTABLE
```

- Tag the backend-flask image
```
docker tag backend-flask:latest 81xxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/backend-flask:latest
```

- Push the docker image to ECR
```
docker push 81xxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/backend-flask:latest
```

![This](/screenshots/containers/backendrepo.png)

![This](/screenshots/containers/backend.png)

#### Creating a service in ECS cluster
- Before you create the service, you should first create an application load balancer with target groups
- Create a file service-backend-flask.json file
```
{
    "cluster": "cruddur",
    "launchType": "FARGATE",
    "desiredCount": 1,
    "enableECSManagedTags": true,
    "enableExecuteCommand": true,
    "loadBalancers": [
        {
            "targetGroupArn": "arn:aws:elasticloadbalancing:us-east-1:81xxxxxxxxxx:targetgroup/cruddur-backend-flask-tg/6ccf071f60c8xxxx",
            "containerName": "backend-flask",
            "containerPort": 4567
        }
    ],
    "networkConfiguration": {
      "awsvpcConfiguration": {
        "assignPublicIp": "ENABLED",
        "securityGroups": [
          "sg-0fdbad7269f44f6a9"
        ],
        "subnets": [
          "subnet-06eaef99a44b9a73f",
          "subnet-07f6a4b47584be90e",
          "subnet-0bef7f3f0c3e89cea"
        ]
      }
    },
    "propagateTags": "SERVICE",
    "serviceName": "backend-flask",
    "taskDefinition": "backend-flask",
    "serviceConnectConfiguration": {
      "enabled": true,
      "namespace": "cruddur",
      "services": [
        {
          "portName": "backend-flask",
          "discoveryName": "backend-flask",
          "clientAliases": [{"port": 4567}]
        }
      ]
    }
  }
```
- Run the command below to create the service
```
aws ecs create-service --cli-input-json file://aws/json/service-backend-flask.json
```

#### Creating a task definition
- Create a file backend-flask.json
```
{
    "family": "backend-flask",
    "executionRoleArn": "arn:aws:iam::81xxxxxxxxxx:role/CruddurServiceExecutionRole",
    "taskRoleArn": "arn:aws:iam::81xxxxxxxxxx:role/CruddurTaskRole",
    "requiresCompatibilities": [ 
       "FARGATE" 
    ],
    "networkMode": "awsvpc",
    "cpu": "256",
    "memory": "512",
    "containerDefinitions": [
      {
        "name": "backend-flask",
        "image": "81xxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/backend-flask",
        "cpu": 256,
        "memory": 512,
        "essential": true,
        "healthCheck": {
          "command": [
            "CMD-SHELL",
            "python /backend-flask/bin/flask/health-check"
          ],
          "interval": 30,
          "timeout": 5,
          "retries": 3,
          "startPeriod": 60
        },
        "portMappings": [
          {
            "name": "backend-flask",
            "containerPort": 4567,
            "protocol": "tcp", 
            "appProtocol": "http"
          }
        ],
        
        "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
              "awslogs-group": "cruddur",
              "awslogs-region": "us-east-1",
              "awslogs-stream-prefix": "backend-flask"
          }
        },
        "environment": [
          {"name": "AWS_COGNITO_USER_POOL_ID", "value": "xxxxx"},
          {"name": "AWS_COGNITO_USER_POOL_CLIENT_ID", "value": "xxxx"},
          {"name": "FRONTEND_URL", "value": "*"},
          {"name": "BACKEND_URL", "value": "*"},
          {"name": "AWS_DEFAULT_REGION", "value": "us-east-1"}
        ],
        "secrets": [
          {"name": "AWS_ACCESS_KEY_ID"    , "valueFrom": "arn:aws:ssm:us-east-1:81xxxxxxxxxx:parameter/cruddur/backend-flask/AWS_ACCESS_KEY_ID"},
          {"name": "AWS_SECRET_ACCESS_KEY", "valueFrom": "arn:aws:ssm:us-east-1:81xxxxxxxxxx:parameter/cruddur/backend-flask/AWS_SECRET_ACCESS_KEY"},
          {"name": "CONNECTION_URL"       , "valueFrom": "arn:aws:ssm:us-east-1:81xxxxxxxxxx:parameter/cruddur/backend-flask/CONNECTION_URL" }
        ]
      }
    ]
  }
```
- Register the task definition
```
aws ecs register-task-definition --cli-input-json file://aws/task-defintions/backend-flask.json
```
![This](/screenshots/containers/regtask.png)

![This](/screenshots/containers/taskdef.png)

![This](/screenshots/containers/overview.png)

![This](/screenshots/containers/metrics.png)

### To login to a container in the ecs
```
aws ecs execute-command \
    --cluster cruddur \
    --task 358408856699414c8c6540a821b90cab \
    --container backend-flask \
    --command "/bin/bash" \
    --interactive 
```
![This](/screenshots/containers/logincont.png)

#### install session manager plugin
- step 1
```
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb"
```
- step 2
```
sudo dpkg -i session-manager-plugin.deb
```

#### Testing the backend container and the load balancer

- Check the health of the tasks, it should be healthy

![This](/screenshots/containers/taskhealth.png)

- Check the tasks logs

![This](/screenshots/containers/backlogs.png)

- Check the target groups health

![This](/screenshots/containers/tghealth.png)

- Test the load balancer by copying the DNS on the browser

![This](/screenshots/containers/dnstest.png)


## Deploying the frontend 

### steps

- Creating the frontend repository

```
aws ecr create-repository \
  --repository-name frontend-react-js \
  --image-tag-mutability MUTABLE
```

![This](/screenshots/containers/frontrepo.png)

- Build the Dockerfile.prod
```
docker build \
--build-arg REACT_APP_BACKEND_URL="https://4567-$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST" \
--build-arg REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_USER_POOLS_ID="ca-central-1_CQ4wDfnwc" \
--build-arg REACT_APP_CLIENT_ID="5b6ro31g97urk767adrbrdj1g5" \
-t frontend-react-js \
-f Dockerfile.prod \
.
```

- Tag the newly built frontend image
```
docker tag frontend-react-js:latest 81xxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/frontend-react-js:latest
```

- Push the docker image to ECR
```
docker push 81xxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/frontend-react-js:latest
```

![This](/screenshots/containers/frontimg.png)

- Create a task definition
![This](/screenshots/containers/taskdefF.png)

- Create a service in the ECS cluster
![This](/screenshots/containers/serviceF.png)

- Check the health of tasks and target groups

![This](/screenshots/containers/contF.png)

![This](/screenshots/containers/serviceH.png)

![This](/screenshots/containers/fronttgh.png)

![This](/screenshots/containers/fronttaskhealth.png)

- lastly test the load balancer

![This](/screenshots/containers/testdnsfront.png)

