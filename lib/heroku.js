const fetch = require('node-fetch');

/**
 * Get the slug used for the most recent release of a Heroku app. The slug will be used to deploy
 * a new version with the same code.
 * @param {String} app - Heroku app name.
 * @param {String} apiKey - Heroku API key.
 * @returns {Promise.<String>} Promise containing slug ID.
 */
exports.getLatestReleaseSlug = async (app, apiKey) => {
  const res = await fetch(`https://api.heroku.com/apps/${app}/releases`, {
    headers: {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Range: 'version ..; max=1, order=desc'
    }
  });

  if (!res.ok) {
    throw new Error('Could not fetch latest release from Heroku.');
  }

  const data = await res.json();

  return data[0].slug.id;
};

exports.getSlugUrl = async (app, slugId, apiKey) => {
  const res = await fetch(`https://api.heroku.com/apps/${app}/slugs/${slugId}`, {
    headers: {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Could not fetch slug tarball from Heroku.');
  }

  const data = await res.json();

  return data.blob.url;
};

exports.createNewBuild = async (app, slug, apiKey) => {
  const res = await fetch(`https://api.heroku.com/apps/${app}/builds`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // eslint-disable-next-line camelcase
      source_blob: {
        url: slug
      }
    })
  });

  if (!res.ok) {
    console.log(await res.json());
    throw new Error('Could not create a new build on Heroku');
  }
};
