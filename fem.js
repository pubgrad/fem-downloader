const Async = require('crocks/Async');
const Either = require('crocks/Either');
const constant = require('crocks/combinators/constant');
const fs = require('fs');
const https = require('https');
const slugify = require('slugify');
const { Left, Right } = Either;
const _cliProgress = require('cli-progress');

const stringToEither = (s) => (s.length ? Right(s) : Left(s));

const femGoto = (url) => (page) =>
  Async((rej, res) => {
    page.goto(url).then((a) => res(page));
  });

const femLogin = (username, password) => (page) => {
  return Async((rej, res) => {
    (async function() {
      try {
        await page.type('#username', username, { delay: 50 });
        await page.type('#password', 'dash-dash-432', { delay: 50 });
        await page.type('#password', String.fromCharCode(13));
        await page.waitForSelector('div.Message.MessageAlert', { timeout: 0 });
        await page.type('#password', password, { delay: 50 });
        await page.type('#password', String.fromCharCode(13));
        await page.waitForSelector('h1.DashboardHeader', { timeout: 0 });
      } catch (e) {
        rej(e);
      }
      res(page);
    })();
  });
};

const allLessonsFrom = (fromLesson, found = false) => (lesson) => {
  if (found) return true;
  if (lesson.includes(fromLesson)) {
    found = true;
    return true;
  }
  return false;
};

const buildDirTree = (courseSlug, fromLesson = '') => (page) =>
  Async((rej, res) => {
    (async function() {
      const lessons = await page.evaluate(function getLessons() {
        const titles = Array.from(document.querySelectorAll('h2.lessongroup'));
        const lessons = Array.from(document.querySelectorAll('ul.LessonList'));

        const titleSlugs = titles.map((title) => title.textContent);

        const result = lessons
          .map((list, index) => ({
            [index]: Array.from(list.querySelectorAll('li a'))
          }))
          .map((lessons, index) =>
            lessons[index].map((a) => a.getAttribute('href'))
          )
          .map((lessons, index) => ({ [titleSlugs[index]]: lessons }));

        return Promise.resolve(result);
      });

      const newKeys = lessons.map((o) =>
        slugify(Object.keys(o)[0].toLowerCase())
      );
      {
        let slugLessons = lessons
          .map((l, index) => ({
            title: `${index}-${newKeys[index]}`,
            index: index,
            lessons: l[Object.keys(l)[0]]
          }))
          .map((lessonGroup) =>
            stringToEither(fromLesson)
              .map((fromLesson) => allLessonsFrom(fromLesson))
              .map((onlyFromLesson) =>
                lessonGroup.lessons.filter(onlyFromLesson)
              )
              .either(constant(lessonGroup), (ll) =>
                Object.assign({}, lessonGroup, { lessons: ll })
              )
          );

        if (!fs.existsSync(courseSlug)) fs.mkdirSync(courseSlug);

        slugLessons
          .map((lesson) => lesson.title)
          .map((title) => `./${courseSlug}/${title}`)
          .map((dir) => (!fs.existsSync(dir) ? fs.mkdirSync(dir) : null));

        res({ page, slugLessons });
      }
    })();
  });

const downloadVideoLesson = (page) => async (
  lessonGroup,
  index,
  courseSlug,
  baseUrl,
  lessonUrl
) => {
  await page.goto(`${baseUrl}${lessonUrl}`, {
    waitUnil: ['load', 'domcontentloaded', 'networkidle0']
  });

  await page.waitForSelector('div.vjs-has-started');

  const src = await page.evaluate(() => {
    const video = document.querySelector('video.vjs-tech');
    return Promise.resolve(video.getAttribute('src'));
  });

  await page.click('div.vjs-has-started');
  const lessonTitles = lessonUrl.split('/');

  const lessonTitle = lessonTitles[lessonTitles.length - 2];
  const file = fs.createWriteStream(
    `./${courseSlug}/${lessonGroup}/${index}-${lessonTitle}.webm`
  );

  return new Promise((resolve, reject) =>
    https.get(src, function(resp) {
      console.log(
        `\n${new Date().toLocaleTimeString()}: Downloading: ${index}-${lessonTitle}`
      );

      const bytesLength = parseInt(resp.headers['content-length'] / 8);

      const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
      let totalBytes = 0;
      bar.start(bytesLength, 0);

      resp.on('data', function(chunk) {
        file.write(chunk);
        totalBytes = totalBytes + parseInt(chunk.length / 8);
        bar.update(totalBytes);
      });

      resp.on('end', function() {
        bar.update(bytesLength);
        bar.stop();
        file.end();
        resolve(true);
      });
    })
  );
};

const downloadVideos = (url, courseSlug) => ({ page, slugLessons }) => {
  return Async(async (rej, res) => {
    const downloadLesson = downloadVideoLesson(page);

    for (const lessonGroup of slugLessons) {
      let lessons = lessonGroup.lessons;
      let group = lessonGroup.title;
      let index = 1;
      for (const lesson of lessons) {
        await downloadLesson(group, index, courseSlug, url, lesson);
        index = index + 1;
      }
    }
    res('YEEEEEAH!');
  });
};

module.exports = {
  femLogin,
  buildDirTree,
  downloadVideos,
  femGoto
};
