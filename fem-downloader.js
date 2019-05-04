const commandLineArgs = require('command-line-args');
const { init } = require('./api');
const Async = require('crocks/Async');
const {
  femLogin,
  femGoto,
  buildDirTree,
  downloadVideos,
  persistCookies
} = require('./fem');
const inquirer = require('inquirer');
const pipeK = require('crocks/helpers/pipeK');
const log = console.log.bind(console);

const { getPage, closeBrowser } = init();

const flow = url => (username, password, courseSlug, headless, fromLesson) =>
  getPage(`${url}/login/`, headless)()
    .chain(femLogin(username, password))
    .chain(femGoto(`${url}/courses/${courseSlug}/`))
    .chain(buildDirTree(courseSlug, fromLesson))
    .chain(downloadVideos(url, courseSlug))
    .chain(closeBrowser);

const femDownload = flow('https://frontendmasters.com');

const questions = [
  { type: 'input', message: 'Please insert your username:', name: 'username' },
  {
    type: 'password',
    message: 'Please insert your password:',
    name: 'password',
    mask: '*'
  },
  { type: 'input', message: 'Please insert course slug:', name: 'slug' },
  {
    type: 'confirm',
    message: 'Launch Puppeteer in headless mode? :',
    name: 'headless'
  },
  {
    type: 'confirm',
    message: 'Are the information correct ?',
    name: 'confirmation'
  }
];

(async () => {
  const {
    username,
    password,
    slug,
    confirmation,
    headless,
    from = ''
  } = await inquirer.prompt(questions);

  if (!confirmation) {
    return;
  }

  [slug]
    .map(title => femDownload(username, password, title, headless, from))
  const answers = await inquirer.prompt(questions);

  course
    .map(title => femDownload(username, password, title, from))
    .reduce((pipe, fn) => pipe.chain(() => fn), Async.Resolved())
    .fork(e => log('Error: ', e), s => log('Success: ', s));
})();
