# vuetorrent-backend

This project is a Node.js web service designed to enhance the capabilities of [VueTorrent](https://github.com/VueTorrent/VueTorrent) users.

## Docker

This repository provides a Docker image to use it directly.

### Using Github Container Registry

Pull the image from the [GitHub Container Registry](https://github.com/VueTorrent/vuetorrent-backend/pkgs/container/vuetorrent-backend):

```bash
docker pull ghcr.io/vuetorrent/vuetorrent-backend
docker run -p "3000:3000" -v "./data:/app/data" ghcr.io/vuetorrent/vuetorrent-backend
```

Or from the included `docker-compose.yml`:

```bash
docker compose pull
docker compose up -d
```

Note: To target a specific version of the image, you must edit the `docker-compose.yml` file and change the image tag.
See [this doc](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#pull-by-digest) for more information.

### From source

You'll have to toggle the comment of build and image attribute in `docker-compose.yml` to use the local image.

```bash
docker compose build
docker compose up -d
```

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

Every endpoints are detailed in the [Wiki](https://github.com/VueTorrent/vuetorrent-backend/wiki/Endpoints).

## Configuration

The configuration data is stored in `data\data.json`.

You can populate it with initial key-value pairs by exporting your existing configuration in VueTorrent.

> [!TIP]
> Any configuration will be imported from your browser if no keys are found.

> [!WARNING]
> Every configured instances will replace your VueTorrent configuration with the one from the backend if one has already been imported.
> 
