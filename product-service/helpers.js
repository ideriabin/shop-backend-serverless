exports.executeWithErrorHandler = async (fn) => {
  try {
    return { statusCode: 200, body: JSON.stringify(await fn()) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
