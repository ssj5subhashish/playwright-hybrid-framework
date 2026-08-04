const parallelJobs = process.env.PARALLEL_JOBS ? parseInt(process.env.PARALLEL_JOBS, 10) : undefined;
const parallel = process.env.PARALLEL === 'true' || (parallelJobs && parallelJobs > 1);

module.exports = {
  parallel: !!parallel,
  ...(parallel && parallelJobs && { jobs: parallelJobs })
};
