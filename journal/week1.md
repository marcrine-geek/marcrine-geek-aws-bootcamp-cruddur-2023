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
