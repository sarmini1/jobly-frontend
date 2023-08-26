import { Alert } from "react-bootstrap";

/** Error
 *
 * Props:
 * - error: string
 *
 * State:
 * None
 *
 * Most components --> Error
 */
function Error({ error }) {
  return (
    <div className="Error">
      <Alert variant='danger'>
        <p>{error}</p>
      </Alert>
    </div>

  );
}

export default Error;
