# AWS React Imagery App

Tasks:
- Add images to bucket
  - If the image is greater than 1 MB, call a lambda function to scale it down
- List images on bucket
- Search images on bucket
- Delete images from bucket

### Technologies

- Amazon S3
- Amazon Lambdas
- Docker

### App

- React.js
- TypeScript
- Vite.js

## Docker

Building:

```sh
docker build -t rmcampos/aws-react-img-app:0.0.1 .
```

Running:

```sh
docker run -it --rm \
  -p 5173:5173 \
  --name rmcampos/aws-react-img-app:0.0.1 \
  aws-react-img-app
```

Login:

```sh
docker login -u rmcampos
```

Push image
```sh
docker image push rmcampos/aws-react-img-app:0.0.1
```

### AWS

Running:

```sh
docker run -it --rm -d \
  -p 8080:8080 \
  --name aws-react-img-app \
  docker.io/rmcampos/aws-react-img-app:0.0.1
```
