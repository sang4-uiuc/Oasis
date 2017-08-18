Oasis

A monitoring application for production servers.

To deploy on the dop box:

Create the build:  sudo docker build -t kager/oasis .
Start the container:
sudo docker run -d \
  -e ROOT_URL=http://localhost \
  -p 1717:8080 \
  kager/oasis


Make sure there is only one container and image. 
Can view containers with: sudo docker ps -a 
Stop container: sudo docker stop [container id]
Remove container: sudo docker rm [container id]

View images: sudo docker images
Remove images: sudo docker rmi [image id]

The Docker file removes and installs the node modules on each build.
