// =======================================================
//  NODE.JS FUNDAMENTAL 2: async/await + Event Loop
// =======================================================
//
//  EVENT LOOP in one line:
//  Node runs one thing at a time, but while waiting
//  (for DB, file, network) it goes and does other work.
//  It never blocks — it just parks the waiting task and
//  comes back when it's ready.
//
//  CALLBACK → PROMISE → ASYNC/AWAIT  (evolution)
//
//  async/await is just cleaner syntax for Promises.
//  Under the hood it's the same thing.
// =======================================================

// --- Simulates a database call that takes time ---
function fetchCandidateFromDB(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const fakeDB = {
        1: { id: 1, name: "Alice", role: "Frontend Dev" },
        2: { id: 2, name: "Bob",   role: "Backend Dev"  },
      };

      const candidate = fakeDB[id];
      if (candidate) {
        resolve(candidate);            // success — hand back the data
      } else {
        reject(new Error(`Candidate ${id} not found`));  // failure
      }
    }, 500); // pretend it takes 500ms
  });
}

// --- async/await: reads like synchronous code but isn't ---
async function main() {
  console.log("1. Start — event loop is free");

  try {
    // await pauses THIS function, but NOT the whole server
    const candidate = await fetchCandidateFromDB(1);
    console.log("3. Got candidate:", candidate);
  } catch (err) {
    console.error("Error:", err.message);
  }

  console.log("4. Done");
}

// This logs BEFORE "3. Got candidate" because await is non-blocking
console.log("2. main() called but await is waiting...");
main();

// Output order:
// 1. Start — event loop is free
// 2. main() called but await is waiting...
// 3. Got candidate: { id: 1, name: 'Alice', ... }
// 4. Done

module.exports = { fetchCandidateFromDB };