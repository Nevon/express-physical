const memwatch = require("memwatch-next");
const Util = require("util");
const request = require("supertest");

const app = require("./app")();

// ======= Memory monitoring =======
let hasLeaked = false;
let heapDiff = null;
memwatch.on("leak", info => {
  console.group("Memory leak detected");
  console.error(info);
  hasLeaked = true;
  if (!heapDiff) {
    heapDiff = new memwatch.HeapDiff();
  } else {
    const diff = heapDiff.end();
    console.error(Util.inspect(diff, true, null));
    console.log("Exiting");
    process.exit(1);
  }
  console.groupEnd();
});

memwatch.on("stats", stats => {
  console.group("Stats");
  console.info(Util.inspect(stats, true, null));
  console.groupEnd();
});

// ======= Start =======
const run = () => {
  const passingRequest = () =>
    request(app)
      .get("/passing")
      .expect(200);

  const failingRequest = () =>
    request(app)
      .get("/failing")
      .expect(500);

  let count = 1;
  const makeRequest = () => {
    (count % 2 === 0 ? passingRequest : failingRequest)().then(() => {
      count++;
      if (count > 10000) {
        if (heapDiff) {
          heapDiff.end();
          console.error(Util.inspect(diff, true, null));
        }
        process.exit(hasLeaked ? 1 : 0);
      }
      setTimeout(makeRequest, 0);
    });
  };
  makeRequest();

  setInterval(() => console.info(`Made ${count} requests`), 3000);
};

run();
