export const errorResponse = {
  statusCode: 400,
  body: JSON.stringify({ status: 400, message: "Error" }, null, 2),
};

export const notFoundResponse = {
  statusCode: 404,
  body: JSON.stringify({ status: 404, message: "Not found" }, null, 2),
};

export const successResponse = {
  statusCode: 200,
  body: JSON.stringify({ status: 200, message: "Success" }, null, 2),
};
