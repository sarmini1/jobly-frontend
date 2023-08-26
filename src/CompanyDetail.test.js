import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CompanyDetail from './CompanyDetail';

import JoblyApi from './api';

const fakeUser = {
  applications: new Set()
};

const fakeJob = {
  id: 5,
  title: "Fake job title",
  salary: 100,
  equity: "0.5",
  companyHandle: "fake-handle",
  companyName: "Fake Company"
};

const fakeCompany = {
  handle: "fake-handle",
  name: "Fake Company",
  description: "Not a real company",
  numEmployees: "3",
  logoUrl: "some-link",
  jobs: [fakeJob]
};

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  // console.log(document);
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('mounts without crashing', async function () {
  await act(async () => {
    render(
      <MemoryRouter>
        <CompanyDetail currentUser={{}} addJobApp={() => { }} />
      </MemoryRouter>
      , container);
  });
});

it("matches snapshot", async function () {
  await act(async () => {
    render(
      <MemoryRouter>
        <CompanyDetail currentUser={{}} addJobApp={() => { }} />
      </MemoryRouter>
      , container);
  });
  expect(container).toMatchSnapshot();
});

it("renders appropriate item content from URL parameter", async function () {
  const mockGetCompany =
    jest
      .spyOn(JoblyApi, "getCompany")
      .mockImplementationOnce(() => Promise.resolve(fakeCompany));

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/companies/fake-handle"]}>
        <Routes>
          <Route
            path="/companies/:handle"
            element={<CompanyDetail currentUser={fakeUser} addJobApp={() => { }} />}
          >
          </Route>
        </Routes>
      </MemoryRouter>
      , container);
  });

  expect(mockGetCompany.mock.calls.length).toEqual(1);

  expect(container).toContainHTML("Not a real company");

  // // remove the mock to ensure tests are completely isolated
  JoblyApi.getCompany.mockRestore();
});

it("handles errors when fetching data from api", async () => {
  const mockGetCompany =
    jest
      .spyOn(JoblyApi, "getCompany")
      .mockImplementationOnce(() => Promise.reject("mock error message"));

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/companies/not-real"]}>
        <Routes>
          <Route
            path="/companies/:handle"
            element={<CompanyDetail currentUser={fakeUser} addJobApp={() => { }} />}
          >
          </Route>
        </Routes>
      </MemoryRouter>
      , container);
  });

  expect(mockGetCompany.mock.calls.length).toEqual(1);

  const error = container.querySelector(".Error");
  expect(error).toContainHTML("mock error message");
  expect(container).not.toContainHTML("Salary");

  const redirectLink = container.querySelector("h2");
  expect(redirectLink).toContainHTML("Back to Companies");

  JoblyApi.getCompany.mockRestore();
});