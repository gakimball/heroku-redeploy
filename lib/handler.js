const queryString = require('query-string');
const {getLatestReleaseSlug, getSlugUrl, createNewBuild} = require('./heroku');

/**
 * Endpoint to deploy a Heroku app in response to an external event. For example, if someone
 * makes a change in the CMS, we can ping this endpoint and make the site rebuild itself.
 * @param {String} envs - Query string of environments.
 * @param {String} apiKey - Heroku API key.
 * @returns {Function} Express middleware function.
 */
module.exports = (envs, apiKey) => {
  if (!envs) {
    throw new Error('No `ENV_LIST` environment variable is set.');
  }

  if (!apiKey) {
    throw new Error('No `API_KEY` environment variable is set.');
  }

  const apps = queryString.parse(envs);

  return async (req, res) => {
    const {query} = req;

    if (!('apps' in query)) {
      res.status(400).send('Expected request to have an `apps` query parameter.');
    }

    const targets = query.apps.split(',');

    const deploys = await Promise.all(targets.map(async target => {
      const appName = apps[target];
      const response = {id: target, app: appName};

      if (!appName) {
        return {...response, ok: false, error: `"${target}" is not in your configuration.`};
      }

      try {
        const slugId = await getLatestReleaseSlug(appName, apiKey);
        const slugUrl = await getSlugUrl(appName, slugId, apiKey);
        const version = await createNewBuild(appName, slugUrl, apiKey);

        return {...response, ok: true, version};
      } catch (error) {
        return {...response, ok: false, error: error.message};
      }
    }));

    const status = deploys.filter(deploy => !deploy.ok).length > 0 ? 500 : 200;

    res.status(status).send(deploys);
  };
};
