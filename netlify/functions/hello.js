// Example Netlify serverless function
export default async (req, context) => {
  return new Response(JSON.stringify({
    message: "Hello from AIhow API!",
    timestamp: new Date().toISOString(),
    path: context.path,
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
