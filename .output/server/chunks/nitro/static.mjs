import { eventHandler, createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const assets = {
  "/checker.png": {
    "type": "image/png",
    "etag": "\"3f9-9IPlyqKiA63hPhZZ0gil1FswpP0\"",
    "mtime": "2022-05-24T21:39:03.034Z",
    "path": "../public/checker.png"
  },
  "/Animations/Standard_Walk.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"27580-By+whmYPL4k4IefVgj8DMwEFY8s\"",
    "mtime": "2022-05-24T21:39:03.678Z",
    "path": "../public/Animations/Standard_Walk.fbx"
  },
  "/Animations/Standing_Idle.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4df60-x6ljFHBhLexyNm+UEm1bnV8ebmA\"",
    "mtime": "2022-05-24T21:39:03.678Z",
    "path": "../public/Animations/Standing_Idle.fbx"
  },
  "/FreeContent/DungeonCrawler_Character.png": {
    "type": "image/png",
    "etag": "\"2da-EllFJ+UZT450mhNvPkbDHhKJC9U\"",
    "mtime": "2022-05-24T21:39:03.674Z",
    "path": "../public/FreeContent/DungeonCrawler_Character.png"
  },
  "/FreeMedieval3DPeopleLowPolyPack/License.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"23-SrYVOndwjsnb5MZSFjqGtCdGi0c\"",
    "mtime": "2022-05-24T21:39:03.566Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/License.txt"
  },
  "/FreeMedieval3DPeopleLowPolyPack/readme.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"60-LF/PtH9zTyFf3wlAmoQAG0OoK78\"",
    "mtime": "2022-05-24T21:39:03.390Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/readme.txt"
  },
  "/_nuxt/checker.png": {
    "type": "image/png",
    "etag": "\"3f9-9IPlyqKiA63hPhZZ0gil1FswpP0\"",
    "mtime": "2022-05-24T21:39:02.658Z",
    "path": "../public/_nuxt/checker.png"
  },
  "/_nuxt/entry-d1aeb7ee.mjs": {
    "type": "application/javascript",
    "etag": "\"e1afe-m3KQ8mtlzIJQ9qmj9QE1UnJgOW4\"",
    "mtime": "2022-05-24T21:39:02.658Z",
    "path": "../public/_nuxt/entry-d1aeb7ee.mjs"
  },
  "/_nuxt/entry.27253da5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f41-Ufa06yzjDp1S2DRvyPn/YuAI564\"",
    "mtime": "2022-05-24T21:39:02.654Z",
    "path": "../public/_nuxt/entry.27253da5.css"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"cb-9HcR4KMEB70MkvhMnjLZAcblFPQ\"",
    "mtime": "2022-05-24T21:39:02.654Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/FreeContent/FreeContent/TPose_Character.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"25d90-9o6c6jmA4uRSAatOYDYW4d7uZg0\"",
    "mtime": "2022-05-24T21:39:03.674Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character01.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"22410-k3A8VvWNP3LZ7Tt1w3kRETCKYLo\"",
    "mtime": "2022-05-24T21:39:03.674Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character01.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character02.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"24a60-qjQjfQkJB6IS0rfhvF1JwVjkZkc\"",
    "mtime": "2022-05-24T21:39:03.674Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character02.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character03.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"21a40-sd4+dk8fa/VURbja4pNhXi5Zpko\"",
    "mtime": "2022-05-24T21:39:03.674Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character03.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character04.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"20570-uwf8RLr2748ru4hBep1Zdw7y/cg\"",
    "mtime": "2022-05-24T21:39:03.674Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character04.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character05.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1f7a0-c5pNSkzCPZ3OKJ79LgSmOHJ/nuU\"",
    "mtime": "2022-05-24T21:39:03.670Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character05.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character06.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1d1f0-EsUj2zWvPzG5spayys5yHU6rHhA\"",
    "mtime": "2022-05-24T21:39:03.670Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character06.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character07.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"23680-WsBOe8+PJqQDBNvCGCQQC15o3cY\"",
    "mtime": "2022-05-24T21:39:03.670Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character07.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character08.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"24740-N+wsZM4sl7b9wI+cT+0V1Jd7bYQ\"",
    "mtime": "2022-05-24T21:39:03.670Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character08.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character09.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"21130-mGgYIl15O/zm4tkgzpbmTH2PW28\"",
    "mtime": "2022-05-24T21:39:03.670Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character09.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character10.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"20e20-lakb+uHYZRSyi4GyrBPTqw8/yDg\"",
    "mtime": "2022-05-24T21:39:03.574Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character10.fbx"
  },
  "/FreeContent/FreeContent/TPose_Character11.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1cbb0-oMmgxE/tDVNN3DMtOuBtuNbKciY\"",
    "mtime": "2022-05-24T21:39:03.574Z",
    "path": "../public/FreeContent/FreeContent/TPose_Character11.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/texture/people_texture_map.png": {
    "type": "image/png",
    "etag": "\"9a2-g+2tJJnhG282UiwxOQUKgRR8UQs\"",
    "mtime": "2022-05-24T21:39:03.390Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/texture/people_texture_map.png"
  },
  "/FreeMedieval3DPeopleLowPolyPack/texture/people_texture_map.tx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"f04-7cL6QXrmtQ8HhnUN/Itw8Plc1m8\"",
    "mtime": "2022-05-24T21:39:03.130Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/texture/people_texture_map.tx"
  },
  "/_nuxt/Animations/Standard_Walk.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"27580-By+whmYPL4k4IefVgj8DMwEFY8s\"",
    "mtime": "2022-05-24T21:39:03.030Z",
    "path": "../public/_nuxt/Animations/Standard_Walk.fbx"
  },
  "/_nuxt/Animations/Standing_Idle.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4df60-x6ljFHBhLexyNm+UEm1bnV8ebmA\"",
    "mtime": "2022-05-24T21:39:03.030Z",
    "path": "../public/_nuxt/Animations/Standing_Idle.fbx"
  },
  "/_nuxt/FreeContent/DungeonCrawler_Character.png": {
    "type": "image/png",
    "etag": "\"2da-EllFJ+UZT450mhNvPkbDHhKJC9U\"",
    "mtime": "2022-05-24T21:39:03.030Z",
    "path": "../public/_nuxt/FreeContent/DungeonCrawler_Character.png"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/License.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"23-SrYVOndwjsnb5MZSFjqGtCdGi0c\"",
    "mtime": "2022-05-24T21:39:02.938Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/License.txt"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/readme.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"60-LF/PtH9zTyFf3wlAmoQAG0OoK78\"",
    "mtime": "2022-05-24T21:39:02.706Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/readme.txt"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/city_dwellers_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3cacc-ZJhj1s4HviDxcOEhoyJPht9rjGA\"",
    "mtime": "2022-05-24T21:39:03.566Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/city_dwellers_1.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/city_dwellers_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"346fc-d+pbueGQfQo3DB2nlADjuHMF4vM\"",
    "mtime": "2022-05-24T21:39:03.562Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/city_dwellers_2.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/king.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3c47c-hRMfuw+8/9ovkgkLGVITqm2GPHw\"",
    "mtime": "2022-05-24T21:39:03.562Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/king.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"379dc-nBpvevuQWWbEOPWCbyESwucCjAw\"",
    "mtime": "2022-05-24T21:39:03.558Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_1.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"36b6c-gRvUk5LAl5TpwPEMxwB4fvbsPTg\"",
    "mtime": "2022-05-24T21:39:03.558Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_2.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"355bc-SbL/9qkgU9TlqS7P/GbqarQEtRM\"",
    "mtime": "2022-05-24T21:39:03.554Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_3.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"355dc-hcrPVJKcJalkxK93QvHXx6KnS+I\"",
    "mtime": "2022-05-24T21:39:03.554Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_4.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_5.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"34d2c-q8WJpTIX3m0HTSyX5KbU823Aqf0\"",
    "mtime": "2022-05-24T21:39:03.550Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_5.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_6.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2f2cc-nEvZ+tolbRCeSvrRdh2tLTtfMHg\"",
    "mtime": "2022-05-24T21:39:03.550Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_6.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/queen.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3563c-BBqS6+1CWS9NUi8w0Sxh12siudg\"",
    "mtime": "2022-05-24T21:39:03.546Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/queen.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"37b0c-/nP7cPOXQdhWUxKUvZjSydHC7RE\"",
    "mtime": "2022-05-24T21:39:03.546Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_1.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"385ac-PqyM+83IGmxZ9Bd60oPS+lY9ZNA\"",
    "mtime": "2022-05-24T21:39:03.542Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_2.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"34e1c-lNNV36D9taTYPiBvrM58Cwfwr88\"",
    "mtime": "2022-05-24T21:39:03.434Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_3.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"35efc-gxxCYHGPou92LTA4lZut1e7Gfvs\"",
    "mtime": "2022-05-24T21:39:03.434Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_4.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/city_dwellers_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4d570-EO/0l3h4aTyOw4WTTDZ2AjprjnQ\"",
    "mtime": "2022-05-24T21:39:03.426Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/city_dwellers_1.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/city_dwellers_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"40f90-uZza8n2Fo3FWeHcEcs4ZuLPWrhE\"",
    "mtime": "2022-05-24T21:39:03.426Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/city_dwellers_2.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/king.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4b780-bEdgHxOMw0z661nrSfWjud+2sg4\"",
    "mtime": "2022-05-24T21:39:03.426Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/king.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"46290-Vjc8qBiCvAqlHhAePXKEE7V4iE0\"",
    "mtime": "2022-05-24T21:39:03.422Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_1.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"43b60-JxTUxHb96WQp3HYC2qyoVny82Bo\"",
    "mtime": "2022-05-24T21:39:03.418Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_2.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42860-QI9DNwAbMAhNxjsfcjD5Zv+UjqQ\"",
    "mtime": "2022-05-24T21:39:03.418Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_3.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42760-5ZgV2lsNThfJmlyx9vK+/COaMM4\"",
    "mtime": "2022-05-24T21:39:03.414Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_4.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_5.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42c00-i6T9KG8PoGChFINIHsN8+fTiXSc\"",
    "mtime": "2022-05-24T21:39:03.414Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_5.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_6.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3b000-msfRhPb2NHBMoYzQHkQrULsYalc\"",
    "mtime": "2022-05-24T21:39:03.402Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_6.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/queen.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42810-kNcIxIsdr/r6nIwDQzGPb5cXepo\"",
    "mtime": "2022-05-24T21:39:03.402Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/queen.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"47720-bHCa4S4PKZtc0rubQcwG2XofmXU\"",
    "mtime": "2022-05-24T21:39:03.398Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_1.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"46210-AKsVwfVoSkNp8BrRA6bekvYrgJc\"",
    "mtime": "2022-05-24T21:39:03.398Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_2.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42490-3fWRwVSyt+FaLPqHxLSrYSWdKOE\"",
    "mtime": "2022-05-24T21:39:03.394Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_3.fbx"
  },
  "/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"43380-oj1MqYLUWPutKbd2oors+dwYYX0\"",
    "mtime": "2022-05-24T21:39:03.394Z",
    "path": "../public/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_4.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"ac840-u8ZT/8pNIZRtpXfvVi1ctVSoK6Q\"",
    "mtime": "2022-05-24T21:39:03.130Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"99830-WQ+SqX0w1uxdgBv5hDsFtjCichs\"",
    "mtime": "2022-05-24T21:39:03.130Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character1.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character10.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"99050-E75M4bxWf8N5Tl09KkDXGFNq7f0\"",
    "mtime": "2022-05-24T21:39:03.130Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character10.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character11.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"93e60-uLwPE0/OH1sDkWDJd+HGQhBTl9s\"",
    "mtime": "2022-05-24T21:39:03.126Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character11.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"99bc0-Mr7SbiRLQowYNwhWK5J6g+FTkXI\"",
    "mtime": "2022-05-24T21:39:03.126Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character2.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"97090-IA/GycUmiCEMw7qVLG+po3n7bPs\"",
    "mtime": "2022-05-24T21:39:03.126Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character3.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"96e00-k0SxYIkMbP3Ds7AcN+UeRUFJe3I\"",
    "mtime": "2022-05-24T21:39:03.126Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character4.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character5.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"96600-MalORWTAHPeC//A4uVz2fYsqvxw\"",
    "mtime": "2022-05-24T21:39:03.126Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character5.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character6.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"94ae0-BBW+rcWC2VFw1Hibv40l4MLh1ck\"",
    "mtime": "2022-05-24T21:39:03.122Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character6.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character7.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9bf10-QkIrQsF/0Eq8wdw4rw8viBf0g4M\"",
    "mtime": "2022-05-24T21:39:03.122Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character7.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character8.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9a840-v5A6rCDM26Npdemgh3nnBs3Qfac\"",
    "mtime": "2022-05-24T21:39:03.122Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character8.fbx"
  },
  "/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character9.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"98d70-T/P1LKIhHjFyr1LHCf2R8lkYDPo\"",
    "mtime": "2022-05-24T21:39:03.118Z",
    "path": "../public/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character9.fbx"
  },
  "/VoxelRPGCharacters/Content/Textures/DungeonCrawler_Character.png": {
    "type": "image/png",
    "etag": "\"2da-EllFJ+UZT450mhNvPkbDHhKJC9U\"",
    "mtime": "2022-05-24T21:39:03.118Z",
    "path": "../public/VoxelRPGCharacters/Content/Textures/DungeonCrawler_Character.png"
  },
  "/VoxelRPGCharacters/Content/Weapons/Arrow.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7360-4egz7Dpz56eodIHgMhghvZ+7m00\"",
    "mtime": "2022-05-24T21:39:03.118Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Arrow.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Arrow_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"73e0-Ppi986TTxYx1UMXtiiyEUH2teNI\"",
    "mtime": "2022-05-24T21:39:03.118Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Arrow_1.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Arrow_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"73f0-5ONEM0eWJ9nik7O3/9pMPBOMrqc\"",
    "mtime": "2022-05-24T21:39:03.118Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Arrow_2.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/BowRope.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"74e0-730wZTPlvf5f3XUMVmeVlxtZXEc\"",
    "mtime": "2022-05-24T21:39:03.118Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/BowRope.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/BowRope_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"6ca0-UIOv974yPS0mLF2iM6+cQEYyKxo\"",
    "mtime": "2022-05-24T21:39:03.114Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/BowRope_1.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Knife.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"76b0-NnTeVwmJ3Heat3Uej5LI70Qv2A8\"",
    "mtime": "2022-05-24T21:39:03.106Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Knife.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Knife_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7a80-j0Zom3pCLVQFgSJom6GyJGyr3IQ\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Knife_1.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/LongBow.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8860-XlQnvB798Dx1ny+fomj1u4ssDXc\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/LongBow.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/LongSword.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9100-1GNeb8UfPtKZHpKiIfGJeiPEXfw\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/LongSword.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/LongSword_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"87e0-fs5PqorF8Vcid9Dprg9m4paWUaw\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/LongSword_1.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/LongSword_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8000-LMFyrYCvK6AebmM18Pagb25kG58\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/LongSword_2.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/MagicCane.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8d20-/cWfBsrQOk1d2NEPF5rUEIOnY/k\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/MagicCane.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/MagicCane_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"80e0-wco2Ck7h73CloClZmZJ6GstruQI\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/MagicCane_1.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Shield.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"dd20-PKgoa28dBH4xJNzGa6I/iUqNzJA\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Shield.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Shield_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"87a0-44KdaSjp7HfIlqwsiePEgBbiLyU\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Shield_1.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Shield_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8e20-b7mCKmQP0J9nyKQ7XpmNcAmAha0\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Shield_2.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Spear.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9d80-qRTrFmkvVciFCZ9/Hr3osYlXoRQ\"",
    "mtime": "2022-05-24T21:39:03.090Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Spear.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Spear_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9230-oNKTkZu5l3K0CIm1OZd0RvkUAiM\"",
    "mtime": "2022-05-24T21:39:03.086Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Spear_1.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/SpellBook.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"e1d0-OmjAAAgbpbpD6aMvDpFwIhvn3S8\"",
    "mtime": "2022-05-24T21:39:03.086Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/SpellBook.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Sword.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7e40-NsMUq5qu0z9o552nK32OksHpE1o\"",
    "mtime": "2022-05-24T21:39:03.086Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Sword.fbx"
  },
  "/VoxelRPGCharacters/Content/Weapons/Sword_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7810-Ty3RSBKeSJvKBZXevEifWRYxskE\"",
    "mtime": "2022-05-24T21:39:03.034Z",
    "path": "../public/VoxelRPGCharacters/Content/Weapons/Sword_1.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"25d90-9o6c6jmA4uRSAatOYDYW4d7uZg0\"",
    "mtime": "2022-05-24T21:39:03.030Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character01.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"22410-k3A8VvWNP3LZ7Tt1w3kRETCKYLo\"",
    "mtime": "2022-05-24T21:39:03.030Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character01.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character02.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"24a60-qjQjfQkJB6IS0rfhvF1JwVjkZkc\"",
    "mtime": "2022-05-24T21:39:03.026Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character02.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character03.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"21a40-sd4+dk8fa/VURbja4pNhXi5Zpko\"",
    "mtime": "2022-05-24T21:39:03.026Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character03.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character04.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"20570-uwf8RLr2748ru4hBep1Zdw7y/cg\"",
    "mtime": "2022-05-24T21:39:03.026Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character04.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character05.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1f7a0-c5pNSkzCPZ3OKJ79LgSmOHJ/nuU\"",
    "mtime": "2022-05-24T21:39:03.026Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character05.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character06.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1d1f0-EsUj2zWvPzG5spayys5yHU6rHhA\"",
    "mtime": "2022-05-24T21:39:03.026Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character06.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character07.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"23680-WsBOe8+PJqQDBNvCGCQQC15o3cY\"",
    "mtime": "2022-05-24T21:39:03.026Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character07.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character08.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"24740-N+wsZM4sl7b9wI+cT+0V1Jd7bYQ\"",
    "mtime": "2022-05-24T21:39:03.026Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character08.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character09.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"21130-mGgYIl15O/zm4tkgzpbmTH2PW28\"",
    "mtime": "2022-05-24T21:39:02.942Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character09.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character10.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"20e20-lakb+uHYZRSyi4GyrBPTqw8/yDg\"",
    "mtime": "2022-05-24T21:39:02.942Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character10.fbx"
  },
  "/_nuxt/FreeContent/FreeContent/TPose_Character11.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1cbb0-oMmgxE/tDVNN3DMtOuBtuNbKciY\"",
    "mtime": "2022-05-24T21:39:02.938Z",
    "path": "../public/_nuxt/FreeContent/FreeContent/TPose_Character11.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/texture/people_texture_map.png": {
    "type": "image/png",
    "etag": "\"9a2-g+2tJJnhG282UiwxOQUKgRR8UQs\"",
    "mtime": "2022-05-24T21:39:02.706Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/texture/people_texture_map.png"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/texture/people_texture_map.tx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"f04-7cL6QXrmtQ8HhnUN/Itw8Plc1m8\"",
    "mtime": "2022-05-24T21:39:02.702Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/texture/people_texture_map.tx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/city_dwellers_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3cacc-ZJhj1s4HviDxcOEhoyJPht9rjGA\"",
    "mtime": "2022-05-24T21:39:02.934Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/city_dwellers_1.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/city_dwellers_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"346fc-d+pbueGQfQo3DB2nlADjuHMF4vM\"",
    "mtime": "2022-05-24T21:39:02.934Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/city_dwellers_2.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/king.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3c47c-hRMfuw+8/9ovkgkLGVITqm2GPHw\"",
    "mtime": "2022-05-24T21:39:02.930Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/king.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"379dc-nBpvevuQWWbEOPWCbyESwucCjAw\"",
    "mtime": "2022-05-24T21:39:02.930Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_1.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"36b6c-gRvUk5LAl5TpwPEMxwB4fvbsPTg\"",
    "mtime": "2022-05-24T21:39:02.930Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_2.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"355bc-SbL/9qkgU9TlqS7P/GbqarQEtRM\"",
    "mtime": "2022-05-24T21:39:02.926Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_3.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"355dc-hcrPVJKcJalkxK93QvHXx6KnS+I\"",
    "mtime": "2022-05-24T21:39:02.926Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_4.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_5.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"34d2c-q8WJpTIX3m0HTSyX5KbU823Aqf0\"",
    "mtime": "2022-05-24T21:39:02.918Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_5.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_6.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2f2cc-nEvZ+tolbRCeSvrRdh2tLTtfMHg\"",
    "mtime": "2022-05-24T21:39:02.914Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/peasant_6.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/queen.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3563c-BBqS6+1CWS9NUi8w0Sxh12siudg\"",
    "mtime": "2022-05-24T21:39:02.914Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/queen.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"37b0c-/nP7cPOXQdhWUxKUvZjSydHC7RE\"",
    "mtime": "2022-05-24T21:39:02.910Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_1.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"385ac-PqyM+83IGmxZ9Bd60oPS+lY9ZNA\"",
    "mtime": "2022-05-24T21:39:02.910Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_2.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"34e1c-lNNV36D9taTYPiBvrM58Cwfwr88\"",
    "mtime": "2022-05-24T21:39:02.906Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_3.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"35efc-gxxCYHGPou92LTA4lZut1e7Gfvs\"",
    "mtime": "2022-05-24T21:39:02.798Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/people_unity/rich_citizzens_4.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/city_dwellers_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4d570-EO/0l3h4aTyOw4WTTDZ2AjprjnQ\"",
    "mtime": "2022-05-24T21:39:02.798Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/city_dwellers_1.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/city_dwellers_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"40f90-uZza8n2Fo3FWeHcEcs4ZuLPWrhE\"",
    "mtime": "2022-05-24T21:39:02.798Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/city_dwellers_2.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/king.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4b780-bEdgHxOMw0z661nrSfWjud+2sg4\"",
    "mtime": "2022-05-24T21:39:02.794Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/king.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"46290-Vjc8qBiCvAqlHhAePXKEE7V4iE0\"",
    "mtime": "2022-05-24T21:39:02.794Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_1.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"43b60-JxTUxHb96WQp3HYC2qyoVny82Bo\"",
    "mtime": "2022-05-24T21:39:02.794Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_2.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42860-QI9DNwAbMAhNxjsfcjD5Zv+UjqQ\"",
    "mtime": "2022-05-24T21:39:02.794Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_3.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42760-5ZgV2lsNThfJmlyx9vK+/COaMM4\"",
    "mtime": "2022-05-24T21:39:02.794Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_4.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_5.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42c00-i6T9KG8PoGChFINIHsN8+fTiXSc\"",
    "mtime": "2022-05-24T21:39:02.794Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_5.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_6.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3b000-msfRhPb2NHBMoYzQHkQrULsYalc\"",
    "mtime": "2022-05-24T21:39:02.790Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/peasant_6.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/queen.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42810-kNcIxIsdr/r6nIwDQzGPb5cXepo\"",
    "mtime": "2022-05-24T21:39:02.790Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/queen.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"47720-bHCa4S4PKZtc0rubQcwG2XofmXU\"",
    "mtime": "2022-05-24T21:39:02.790Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_1.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"46210-AKsVwfVoSkNp8BrRA6bekvYrgJc\"",
    "mtime": "2022-05-24T21:39:02.706Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_2.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"42490-3fWRwVSyt+FaLPqHxLSrYSWdKOE\"",
    "mtime": "2022-05-24T21:39:02.706Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_3.fbx"
  },
  "/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"43380-oj1MqYLUWPutKbd2oors+dwYYX0\"",
    "mtime": "2022-05-24T21:39:02.706Z",
    "path": "../public/_nuxt/FreeMedieval3DPeopleLowPolyPack/fbx/unral_better_export/rich_citizens_4.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"ac840-u8ZT/8pNIZRtpXfvVi1ctVSoK6Q\"",
    "mtime": "2022-05-24T21:39:02.694Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"99830-WQ+SqX0w1uxdgBv5hDsFtjCichs\"",
    "mtime": "2022-05-24T21:39:02.690Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character1.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character10.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"99050-E75M4bxWf8N5Tl09KkDXGFNq7f0\"",
    "mtime": "2022-05-24T21:39:02.682Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character10.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character11.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"93e60-uLwPE0/OH1sDkWDJd+HGQhBTl9s\"",
    "mtime": "2022-05-24T21:39:02.682Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character11.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"99bc0-Mr7SbiRLQowYNwhWK5J6g+FTkXI\"",
    "mtime": "2022-05-24T21:39:02.682Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character2.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character3.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"97090-IA/GycUmiCEMw7qVLG+po3n7bPs\"",
    "mtime": "2022-05-24T21:39:02.682Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character3.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character4.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"96e00-k0SxYIkMbP3Ds7AcN+UeRUFJe3I\"",
    "mtime": "2022-05-24T21:39:02.682Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character4.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character5.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"96600-MalORWTAHPeC//A4uVz2fYsqvxw\"",
    "mtime": "2022-05-24T21:39:02.682Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character5.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character6.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"94ae0-BBW+rcWC2VFw1Hibv40l4MLh1ck\"",
    "mtime": "2022-05-24T21:39:02.678Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character6.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character7.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9bf10-QkIrQsF/0Eq8wdw4rw8viBf0g4M\"",
    "mtime": "2022-05-24T21:39:02.678Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character7.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character8.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9a840-v5A6rCDM26Npdemgh3nnBs3Qfac\"",
    "mtime": "2022-05-24T21:39:02.678Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character8.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character9.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"98d70-T/P1LKIhHjFyr1LHCf2R8lkYDPo\"",
    "mtime": "2022-05-24T21:39:02.678Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Characters/DungeonCrawler_Character9.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Textures/DungeonCrawler_Character.png": {
    "type": "image/png",
    "etag": "\"2da-EllFJ+UZT450mhNvPkbDHhKJC9U\"",
    "mtime": "2022-05-24T21:39:02.674Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Textures/DungeonCrawler_Character.png"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Arrow.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7360-4egz7Dpz56eodIHgMhghvZ+7m00\"",
    "mtime": "2022-05-24T21:39:02.674Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Arrow.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Arrow_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"73e0-Ppi986TTxYx1UMXtiiyEUH2teNI\"",
    "mtime": "2022-05-24T21:39:02.674Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Arrow_1.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Arrow_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"73f0-5ONEM0eWJ9nik7O3/9pMPBOMrqc\"",
    "mtime": "2022-05-24T21:39:02.670Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Arrow_2.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/BowRope.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"74e0-730wZTPlvf5f3XUMVmeVlxtZXEc\"",
    "mtime": "2022-05-24T21:39:02.670Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/BowRope.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/BowRope_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"6ca0-UIOv974yPS0mLF2iM6+cQEYyKxo\"",
    "mtime": "2022-05-24T21:39:02.670Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/BowRope_1.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Knife.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"76b0-NnTeVwmJ3Heat3Uej5LI70Qv2A8\"",
    "mtime": "2022-05-24T21:39:02.670Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Knife.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Knife_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7a80-j0Zom3pCLVQFgSJom6GyJGyr3IQ\"",
    "mtime": "2022-05-24T21:39:02.670Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Knife_1.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/LongBow.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8860-XlQnvB798Dx1ny+fomj1u4ssDXc\"",
    "mtime": "2022-05-24T21:39:02.670Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/LongBow.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/LongSword.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9100-1GNeb8UfPtKZHpKiIfGJeiPEXfw\"",
    "mtime": "2022-05-24T21:39:02.670Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/LongSword.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/LongSword_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"87e0-fs5PqorF8Vcid9Dprg9m4paWUaw\"",
    "mtime": "2022-05-24T21:39:02.670Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/LongSword_1.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/LongSword_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8000-LMFyrYCvK6AebmM18Pagb25kG58\"",
    "mtime": "2022-05-24T21:39:02.662Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/LongSword_2.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/MagicCane.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8d20-/cWfBsrQOk1d2NEPF5rUEIOnY/k\"",
    "mtime": "2022-05-24T21:39:02.662Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/MagicCane.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/MagicCane_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"80e0-wco2Ck7h73CloClZmZJ6GstruQI\"",
    "mtime": "2022-05-24T21:39:02.662Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/MagicCane_1.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Shield.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"dd20-PKgoa28dBH4xJNzGa6I/iUqNzJA\"",
    "mtime": "2022-05-24T21:39:02.662Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Shield.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Shield_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"87a0-44KdaSjp7HfIlqwsiePEgBbiLyU\"",
    "mtime": "2022-05-24T21:39:02.662Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Shield_1.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Shield_2.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"8e20-b7mCKmQP0J9nyKQ7XpmNcAmAha0\"",
    "mtime": "2022-05-24T21:39:02.662Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Shield_2.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Spear.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9d80-qRTrFmkvVciFCZ9/Hr3osYlXoRQ\"",
    "mtime": "2022-05-24T21:39:02.658Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Spear.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Spear_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"9230-oNKTkZu5l3K0CIm1OZd0RvkUAiM\"",
    "mtime": "2022-05-24T21:39:02.658Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Spear_1.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/SpellBook.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"e1d0-OmjAAAgbpbpD6aMvDpFwIhvn3S8\"",
    "mtime": "2022-05-24T21:39:02.658Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/SpellBook.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Sword.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7e40-NsMUq5qu0z9o552nK32OksHpE1o\"",
    "mtime": "2022-05-24T21:39:02.658Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Sword.fbx"
  },
  "/_nuxt/VoxelRPGCharacters/Content/Weapons/Sword_1.fbx": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"7810-Ty3RSBKeSJvKBZXevEifWRYxskE\"",
    "mtime": "2022-05-24T21:39:02.658Z",
    "path": "../public/_nuxt/VoxelRPGCharacters/Content/Weapons/Sword_1.fbx"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));
function readAsset (id) {
  return promises.readFile(resolve(mainDir, assets[id].path)).catch(() => {})
}

const publicAssetBases = ["/_nuxt"];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const _static = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  for (const _id of [id, id + "/index.html"]) {
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
      break;
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

export { _static as default };
//# sourceMappingURL=static.mjs.map
