const middleware = async ({ request }: { request: Request }) => {
  const authorization = request.headers.get("Authorization");

  if (authorization !== "Bearer xxxxx") {
    return "Unauthorized";
  }
};

export default middleware;
