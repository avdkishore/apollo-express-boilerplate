import fs from 'fs';

const env = process.env.NODE_ENV || 'development';
const config = {};

/*
  Base configurations
 */
fs.readdirSync(__dirname)
  .filter(f => !f.includes('index.js') && !f.includes('env'))
  .forEach((filename) => {
    // eslint-disable-next-line
    Object.assign(config, require(`./${filename}`).default);
  });

/*
  Environment configuration overrides
 */
const envDir = `${__dirname}/env`;
const isEnvExisting = fs.existsSync(envDir);

if (isEnvExisting) {
  fs.readdirSync(envDir).forEach((filename) => {
    const basename = filename.split('.')[0];

    if (env === basename) {
      // eslint-disable-next-line
      Object.assign(config, require(`./env/${filename}`).default)
    }
  });
}

export default config;
