# AWS React Imagery App

Tasks:
- Add items to Amazon S3 Bucket
- List items
- Get item content
- Delete item

### Technologies

- Amazon S3
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
  -p 5173:80 \
  --name aws-react-img-app \
  rmcampos/aws-react-img-app:0.0.1
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
  -p 5173:80 \
  --name aws-react-img-app \
  docker.io/rmcampos/aws-react-img-app:0.0.1
```
