'use strict';

const getPolicy = (principalId, effect, resource) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

module.exports.basicAuthorizer = async (event) => {
  console.log({ event });

  if (!event.headers.authorization) return { statusCode: 401 };

  const token = event.headers.authorization.split(' ')[1];

  if (Buffer.from(process.env.USER_DATA_STRING).toString('base64') === token) {
    return getPolicy(token, 'Allow', event.routeArn);
  }

  return getPolicy(token, 'Deny', event.routeArn);
};
