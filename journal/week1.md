# Week 1 — App Containerization

## Created a dockerfile at the root of flask project

```
FROM python:3.10-slim-buster

WORKDIR /backend-flask

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_ENV=development

EXPOSE ${PORT}
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]
```

## Build container

```
docker build . -t backend-flask
```

![This](/screenshots/dockerbuild.png)

### Get container images

```
docker images
```

![This](/screenshots/dockerimages.png)

## Run docker container

```
docker run -p 4567:4567  backend-flask
```

![This](/screenshots/dockerrun.png)

### Check running containers

```
docker ps
```

![This](/screenshots/dockerps.png)

## Test server

```
curl -X GET http://localhost:4567/api/activities/home -H "Accept: application/json" -H "Content-Type: application/json"
```

![This](/screenshots/testserver.png)

## Container logs

```
docker logs [CONTAINER ID] -f
```

![This](/screenshots/dockerlogs.png)

## Containerize frontend

### dockerfile

```
FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]
```

### Docker build

```
docker build . -t frontend-react-js
```

![This](/screenshots/dockerbuildF.png)

### Docker run

```
docker run -p 3000:3000 frontend-react-js
```

![This](/screenshots/dockerrunF.png)

### Docker pull

```
docker pull marcrine/backend-flask:latest
```

```
docker pull marcrine/frontend-react-js:latest
```

### Docker compose

```
docker-compose up
```

![This](/screenshots/dockercomposeup.png)

```
docker-compose ps
```

![This](/screenshots/dockercomposeps.png)
