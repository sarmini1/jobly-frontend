import React from 'react';
import { render } from '@testing-library/react';
import Error from "./Error";

it('mounts without crashing', function () {
  render(
    <Error error={"test error text"} />
  );
});

it("matches snapshot", function () {
  const { container } = render(
    <Error error={"test error text"} />
  );
  expect(container).toMatchSnapshot();
});

it("renders expected error info", function () {
  const { container } = render(
    <Error error={"test error text"} />
  );
  expect(container).toContainHTML('<p>test error text</p>');
});