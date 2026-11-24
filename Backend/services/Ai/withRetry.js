const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isTransient = (err) => {
  const msg = String(err?.message || err);
  return /503|429|UNAVAILABLE|overloaded|high demand/i.test(msg);
};

export async function withRetry(run, models, { tries = 2, baseDelay = 800 } = {}) {
  let lastErr;
  for (const model of models) {
    for (let i = 0; i < tries; i++) {
      try {
        return await run(model);
      } catch (err) {
        lastErr = err;
        if (!isTransient(err)) throw err;          
        await sleep(baseDelay * 2 ** i);        
      }
    }
  }
  throw lastErr;
}