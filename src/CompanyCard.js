import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import './CompanyCard.css';


/**
 * CompanyCard Component
 * 
 * Props:
 * - company {}
 * 
 * CompanyList -> CompanyCard
 */
function CompanyCard({ company }) {
  const { name, handle, description, logoUrl } = company;

  return (
    <div className="CompanyCard">
      <Link to={`/companies/${handle}`} style={{ textDecoration: "none" }}>
        <Card className="CompanyCard-card">
          <Card.Title className="justify-content-between text-left">
            <div className="row">
              <b>{name}</b>
              {logoUrl && <img className="CompanyCard-logo ml-auto" src={logoUrl} alt={handle} />}
            </div>
          </Card.Title>
          <Card.Body className="text-left">
            <p>{description}</p>
          </Card.Body>
        </Card>
      </Link>
    </div>
  )
}

export default CompanyCard;