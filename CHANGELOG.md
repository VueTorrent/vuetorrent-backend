# Changelog

## [2.2.0](https://github.com/VueTorrent/vuetorrent-backend/compare/v2.1.3...v2.2.0) (2024-12-15)


### Features

* **Docker:** expose a SKIP_X_FORWARD_HEADERS option ([#75](https://github.com/VueTorrent/vuetorrent-backend/issues/75)) ([b3677ab](https://github.com/VueTorrent/vuetorrent-backend/commit/b3677ab3db379aae3bfe55352e270f81e24843f2))

## [2.1.3](https://github.com/VueTorrent/vuetorrent-backend/compare/v2.1.2...v2.1.3) (2024-10-06)


### Bug Fixes

* **auth:** Handle 401 being thrown on login ([5c0e24b](https://github.com/VueTorrent/vuetorrent-backend/commit/5c0e24bde11b135a11c7fbd8e5156a19530542cf))

## [2.1.2](https://github.com/VueTorrent/vuetorrent-backend/compare/v2.1.1...v2.1.2) (2024-10-01)


### Bug Fixes

* **Docker:** Allow container with non-root user ([#54](https://github.com/VueTorrent/vuetorrent-backend/issues/54)) ([bc4bf70](https://github.com/VueTorrent/vuetorrent-backend/commit/bc4bf707c86d9effefeb5b6226d2df30ff79c5fb))

## [2.1.1](https://github.com/VueTorrent/vuetorrent-backend/compare/v2.1.0...v2.1.1) (2024-09-26)


### Bug Fixes

* **update:** Use release branches instead of release asset ([#51](https://github.com/VueTorrent/vuetorrent-backend/issues/51)) ([25b139b](https://github.com/VueTorrent/vuetorrent-backend/commit/25b139b9986a5fc7154b231377d2664e59ff6a9f))

## [2.1.0](https://github.com/VueTorrent/vuetorrent-backend/compare/v2.0.2...v2.1.0) (2024-09-22)


### Features

* Add auto-update scheduler for WebUI ([16bd320](https://github.com/VueTorrent/vuetorrent-backend/commit/16bd3204615e02bb7b4d089776138345d99c16be))


### Bug Fixes

* Make dev-only CONFIG_PATH env optional ([503434b](https://github.com/VueTorrent/vuetorrent-backend/commit/503434b512e73c422d5b884535990ff46c1b1242))

## [2.0.2](https://github.com/VueTorrent/vuetorrent-backend/compare/v2.0.1...v2.0.2) (2024-09-20)


### Bug Fixes

* **router:** Remove /backend prefix on /api requests ([#45](https://github.com/VueTorrent/vuetorrent-backend/issues/45)) ([512c619](https://github.com/VueTorrent/vuetorrent-backend/commit/512c61959d28093356482754a395f4349e8fd6b2))


### Performance Improvements

* Update 404 error message ([#43](https://github.com/VueTorrent/vuetorrent-backend/issues/43)) ([fc5a1dd](https://github.com/VueTorrent/vuetorrent-backend/commit/fc5a1ddecaa13aa42da204a69da51dbd76de68ca))

## [2.0.1](https://github.com/VueTorrent/vuetorrent-backend/compare/v2.0.0...v2.0.1) (2024-09-19)


### Bug Fixes

* Add /backend prefix to all routes ([#40](https://github.com/VueTorrent/vuetorrent-backend/issues/40)) ([4849614](https://github.com/VueTorrent/vuetorrent-backend/commit/4849614fa8fbbde1059ac24ffa437348d79140c5))

## [2.0.0](https://github.com/VueTorrent/vuetorrent-backend/compare/v1.2.3...v2.0.0) (2024-09-18)


### ⚠ BREAKING CHANGES

* Forward API requests to qBittorrent ([#35](https://github.com/VueTorrent/vuetorrent-backend/issues/35))

### Features

* Add update management routes ([#36](https://github.com/VueTorrent/vuetorrent-backend/issues/36)) ([f26dffe](https://github.com/VueTorrent/vuetorrent-backend/commit/f26dffeb7f6854f431a7cc7b70754de1e4be8024))
* Forward API requests to qBittorrent ([#35](https://github.com/VueTorrent/vuetorrent-backend/issues/35)) ([acd643b](https://github.com/VueTorrent/vuetorrent-backend/commit/acd643b05746dcb65fbadf4509c16cea23d81b03))

## [1.2.3](https://github.com/VueTorrent/vuetorrent-backend/compare/v1.2.2...v1.2.3) (2024-06-07)


### Reverts

* Add ARM architectures support ([#23](https://github.com/VueTorrent/vuetorrent-backend/issues/23)) ([#25](https://github.com/VueTorrent/vuetorrent-backend/issues/25)) ([ed80b5a](https://github.com/VueTorrent/vuetorrent-backend/commit/ed80b5a55080bd1366fc44fdc3a7f56b0a46ee9d))

## [1.2.2](https://github.com/VueTorrent/vuetorrent-backend/compare/v1.2.1...v1.2.2) (2024-06-07)


### Bug Fixes

* **docker:** Add ARM architectures support ([#23](https://github.com/VueTorrent/vuetorrent-backend/issues/23)) ([14fdaf9](https://github.com/VueTorrent/vuetorrent-backend/commit/14fdaf9cac4a825a64d01b23cfa6774fa09f3634))

## [1.2.1](https://github.com/VueTorrent/vuetorrent-backend/compare/v1.2.0...v1.2.1) (2024-05-12)


### Bug Fixes

* **docker:** Enable multi-platform build ([946717b](https://github.com/VueTorrent/vuetorrent-backend/commit/946717b94fb717efc43c4144298b255e8e9069f6))

## [1.2.0](https://github.com/VueTorrent/vuetorrent-backend/compare/v1.1.2...v1.2.0) (2024-05-12)


### Features

* docker container support arm64 ([#18](https://github.com/VueTorrent/vuetorrent-backend/issues/18)) ([b7666f2](https://github.com/VueTorrent/vuetorrent-backend/commit/b7666f209b7b9e1649d37db46b42c1a1f4061c0d))

## [1.1.2](https://github.com/VueTorrent/vuetorrent-backend/compare/v1.1.1...v1.1.2) (2024-05-08)


### Bug Fixes

* **docker:** Switch to alpine base to reduce image size ([4214e9b](https://github.com/VueTorrent/vuetorrent-backend/commit/4214e9b90d9df90e96925d5665184c7ef5783725))

## [1.1.1](https://github.com/VueTorrent/vuetorrent-backend/compare/v1.1.0...v1.1.1) (2024-05-08)


### Bug Fixes

* **auth:** Add DISABLE_AUTH env to disable auth check ([#15](https://github.com/VueTorrent/vuetorrent-backend/issues/15)) ([f09899d](https://github.com/VueTorrent/vuetorrent-backend/commit/f09899d19321f9b25f1b391635be88f2df656254))

## [1.1.0](https://github.com/VueTorrent/vuetorrent-backend/compare/v1.0.0...v1.1.0) (2024-04-01)


### Features

* Handle authentication through qbit ([#10](https://github.com/VueTorrent/vuetorrent-backend/issues/10)) ([3954e99](https://github.com/VueTorrent/vuetorrent-backend/commit/3954e991f7f79784d854440e1b574ebfce79452e))

## 1.0.0 (2024-03-15)


### Features

* **config:** Create server-side store ([bdd15e4](https://github.com/VueTorrent/vuetorrent-backend/commit/bdd15e404e9efc839ef3023d74ba7011b31fe46d))
