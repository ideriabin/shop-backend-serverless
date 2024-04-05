class ValidationError extends Error {}

exports.ValidationError = ValidationError;

exports.executeWithErrorHandler = async (fn) => {
  try {
    return { statusCode: 200, body: JSON.stringify(await fn()) };
  } catch (e) {
    return { statusCode: e instanceof ValidationError ? 400 : 500, body: JSON.stringify({ error: e.message }) };
  }
};
