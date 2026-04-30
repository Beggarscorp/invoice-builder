export const dynamic = 'force-dynamic';

export default function DebugPage() {
  return (
    <div>
      <p>DB_HOST: {process.env.DB_HOST}</p>
      <p>DB_USER: {process.env.DB_USER}</p>
      <p>DB_NAME: {process.env.DB_NAME}</p>
      <p>DB_PORT: {process.env.DB_PORT}</p>
      <p>DB_PORT: {process.env.DB_PORT}</p>
    </div>
  );
}