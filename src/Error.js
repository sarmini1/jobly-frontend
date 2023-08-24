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
function Error({error}) {
  return (
    <Alert variant='danger'>
      <p>{error}</p>
    </Alert>
  );
}

export default Error;
