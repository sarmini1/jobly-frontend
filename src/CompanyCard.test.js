import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import CompanyCard from "./CompanyCard";

const testCompany = {
  "name": "test company name",
  "handle": "test-company-handle",
  "description": "Great company to work for!",
  // "logoUrl":
};

it('mounts without crashing', function () {
  render(
    <MemoryRouter>
      <CompanyCard company={testCompany} />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { container } = render(
    <MemoryRouter>
      <CompanyCard company={testCompany} />
    </MemoryRouter>
  );
  expect(container).toMatchSnapshot();
});