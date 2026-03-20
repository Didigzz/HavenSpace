/**
 * Serverless function for health check endpoint
 * This file exports a handler that can be deployed to serverless platforms
 */

/**
 * Health check handler
 * @returns Response with health status
 */
export const GET = async (): Promise<Response> => {
  return new Response(
    JSON.stringify({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "havenspace-api",
      version: "0.1.0",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

/**
 * Default export for platforms that require it
 */
export default GET;
