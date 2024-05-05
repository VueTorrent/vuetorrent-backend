# vuetorrent-backend

This project is a Node.js web service designed to enhance the capabilities of [VueTorrent](https://github.com/VueTorrent/VueTorrent) users.

> [!TIP]
> Installation guide can be found in the [wiki](https://github.com/VueTorrent/vuetorrent-backend/wiki/Installation)

> [!CAUTION]
> Due to qBittorrent's SID cookie security policy, the backend can't be used on different hostnames, see [#13](https://github.com/VueTorrent/vuetorrent-backend/issues/13).
> 
> Which means that the only way to have the backend to work is by using different explicit ports or subroutes on the same host.
>
> More info in the [caveats section of the wiki](https://github.com/VueTorrent/vuetorrent-backend/wiki/Installation#caveats)

Endpoints are accessible using tools like cURL, Postman, or by making HTTP requests from your browser or any programming language/framework.

Every endpoints are detailed in the [Wiki](https://github.com/VueTorrent/vuetorrent-backend/wiki/Endpoints).

## Configuration

The configuration data is stored in `data\data.json`.

You can populate it with initial key-value pairs by exporting your existing configuration in VueTorrent.

> [!TIP]
> Any configuration will be imported from your browser if no keys are found.

> [!WARNING]
> Every configured instances will replace your VueTorrent configuration with the one from the backend if one has already been imported.
> 
