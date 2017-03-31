# tomo-server


```docker
docker run -it --name tomodev -p 443:443 -v $(pwd)/global.j$(pwd)/config/bal.js -v ~/Github/DockerFiles/tomo-server/certificates/:/certificates -v $(pwd)/resources/apn:/apn -v ~/Github/tomo-server:/tomo-server --link mongo:mongo --link redis:redis -e NODE_ENV=development node:7.4.0-alpine sh
```
