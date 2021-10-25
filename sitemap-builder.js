require('babel-register')({
  presets: ['es2015', 'react'],
}); // for backward compatibility

const fs = require('fs');
const sitemapBuilder = require('react-router-sitemap').sitemapBuilder;
const { appendRoutes } = require('./server/meta');

const apiPath =
  process.env.REACT_APP_BACKEND_URL || 'https://staging-api.wallfair.io/';

const siteURL = process.env.REACT_APP_URL || 'http://play.wallfair.io/';

const enableSitemap = process.env.ENABLE_SITE_MAP || 0;

const listPaths = ['api/event/list'];

function generateSitemap () {
  enableSitemap ?
    appendRoutes(apiPath, listPaths).then(meta => {
      const paths = Object.keys(meta);
      const sitemap = sitemapBuilder(siteURL, paths);
      fs.writeFile('./public/sitemap.xml', sitemap.toXML(), function (err) {
        if (err) throw err;
        console.log('Sitemap generated!');
      });
    }) : console.log('Sitemap not required!');
}

generateSitemap();
