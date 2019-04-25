# heroku-redeploy

> Heroku app to redeploy Heroku apps

[![Travis](https://img.shields.io/travis/gakimball/heroku-redeploy.svg?maxAge=2592000)](https://travis-ci.org/gakimball/heroku-redeploy)

This is a small Node.js app that can receive webhooks, and redeploy Heroku apps in response.

If you have a static site connected to a CMS, or another external data source, you can use this to trigger new Heroku builds on your apps. Heroku's Platform API doesn't have a simple way to redeploy an app using the same code and environment, which is why you might need to use a service like this.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Setup

### Deploying

Deploy this repository to Heroku, or whatever cloud service you like. Set these two env variables:

```
ENV_LIST=staging=appname-staging&production=appname-production
API_KEY=xxx-xxx
```

`API_KEY` is a Heroku API key. It needs to have permission to deploy all of the apps you configure.

`ENV_LIST` is a query string with what apps you want to deploy. The key is a nickname for the app, like `dev`, `staging`, or `production`. The value is the name of the Heroku app.

### Webhooks

A basic webhook looks like this:

```
POST https://xxx.herokuapp.com/deploy?apps=staging
```

You can deploy multiple apps at once by separating them with commas:

```
POST https://xxx.herokuapp.com/deploy?apps=staging,production
```

You can also add a `source` parameter that tells the deployer where the webhook is coming from. This information will be added to the release description in Heroku, to give more context.

```
POST https://xxx.herokuapp.com/deploy?apps=staging,production&source=Contentful
```

The endpoint returns a JSON response with an array of apps that were targeted for redeployment. Note that `ok: true` only means that a new release was created—it doesn't mean it was successfully built.

```json
[
  {
    "id": "staging",
    "app": "appname-staging",
    "ok": true,
    "version": 123
  },
  {
    "id": "production",
    "app": "appname-production",
    "ok": false,
    "error": "..."
  }
]
```

## Local Development

```bash
git clone https://github.com/gakimballl/heroku-redeploy
cd heroku-redeploy
npm install
npm test
```

## License

MIT &copy; [Geoff Kimball](https://geoffkimball.com)
