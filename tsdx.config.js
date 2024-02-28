module.exports = {
  rollup(config, options) {

    if (config.output instanceof Array) {
      config.output = config.output?.filter(
        (output) => !(output.format === 'cjs' && output.env === 'development')
      );
    }


    return config;
  },
};
