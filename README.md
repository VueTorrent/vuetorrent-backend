# vuetorrent-backend

This is a simple Node.js web service that handles a basic key-value configuration file. It provides endpoints to retrieve all key-value pairs, retrieve the value of a specific key, and update or create key-value pairs.

## Endpoints

- `GET /config`: Retrieve all key-value pairs from the configuration file
- `GET /config/:key`: Retrieve the value of a specific key
- `PUT /config/:key`: Update or create key-value pairs in the configuration file
- `DELETE /config/:key`: Delete a pair in the configuration file

## Installation

```bash
# Clone the repository
git clone git@github.com:VueTorrent/vuetorrent-backend.git

# Navigate to the project directory
cd vuetorrent-backend

# Install dependencies
npm install
```

## Usage

```bash
# Start the server
npm start
```
This will start the Node.js server on port 3000 by default.

Access the endpoints using tools like cURL, Postman, or by making HTTP requests from your browser or any programming language/framework.

## Configuration

The configuration file is named `data.json` and is located in the root directory of the project. You can populate it with initial key-value pairs.

## Docker Compose

You can also run the application using Docker.

### Using Github Container Registry

```bash
# Pull image
docker compose pull

# Run the container
docker compose up
```

Note: To target a specific version of the image, you must edit the `docker-compose.yml` file and change the image tag.
See [this doc](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#pull-by-digest) for more information.

### From source

You'll have to toggle the comment of build and image attribute in `docker-compose.yml` to use the local image.

```bash
# Build the image
docker compose build

# Run the container
docker compose up
```
