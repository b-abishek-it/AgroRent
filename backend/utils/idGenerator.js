const Counter = require("../models/Counter");

const generatePrefixedId = async ({ key, prefix, pad = 3 }) => {
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return `${prefix}${String(counter.seq).padStart(pad, "0")}`;
};

module.exports = { generatePrefixedId };
