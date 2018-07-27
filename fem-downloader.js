const commandLineArgs = require("command-line-args");
const { init } = require("./api");
const {
  femLogin,
  femGoto,
  buildDirTree,
  downloadVideos,
  getCookies,
  persistCookies
} = require("./fem");

const pipeK = require("crocks/helpers/pipeK");
const log = console.log.bind(console);

const { getPage, closeBrowser } = init();

const flow = url => (username, password, courseSlug, fromLesson) =>
  getPage(`${url}/login/`)()
    .chain(femLogin(username, password))
    .chain(femGoto(`${url}/courses/${courseSlug}/`))
    .chain(buildDirTree(courseSlug, fromLesson))
    .chain(downloadVideos(url, courseSlug))
    .chain(closeBrowser);

const femDownload = flow("https://frontendmasters.com");

const optionDefinitions = [
  {
    name: "username",
    alias: "u",
    type: String
  },
  {
    name: "password",
    alias: "p",
    type: String
  },
  {
    name: "course",
    alias: "c",
    type: String
  },
  {
    name: "from",
    alias: "f",
    type: String
  }
];

const options = commandLineArgs(optionDefinitions);

const { username, password, course, from } = options;

femDownload(username, password, course, from).fork(
  e => log("Error: ", e),
  s => log("Success: ", s)
);
