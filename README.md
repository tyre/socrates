## Socrates

Backend Node server to capture/parse analytics data to be stored in Redis.
Also contains front-end javascript to extract behavioral information and send back to the server.

The application and front-end scripts are written entirely in CoffeeScript. As such, the compiled Javascript files are not included in the repository; life is too short for accidentally committing out-of-date source files.

The backend is (and should remain) quite simple && clean. A 1x1 pixel transparent GIF will be loaded client-side, with all relevant tracking information passed as parameters.