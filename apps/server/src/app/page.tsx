export default function APIHome() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>BHMS API Server</h1>
      <p>This is the API server for the Haven Space platform.</p>
      <h2>Available Endpoints:</h2>
      <ul>
        <li><code>POST /api/trpc/*</code> - tRPC API endpoints</li>
        <li><code>GET /api/health</code> - Health check</li>
        <li><code>POST /api/auth/*</code> - Authentication endpoints</li>
      </ul>
    </div>
  );
}
