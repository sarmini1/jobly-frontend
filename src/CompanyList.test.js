import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { screen } from '@testing-library/react';
import CompanyList from './CompanyList';

import JoblyApi from './api';
import { fireEvent } from '@testing-library/react';

const fakeUser = {
  applications: new Set()
};

// const fakeJob = {
//   id: 5,
//   title: "Fake job title",
//   salary: 100,
//   equity: "0.5",
//   companyHandle: "fake-handle",
//   companyName: "Fake Company"
// };

const fakeCompany1 = {
  handle: "fake-handle1",
  name: "Fake Company 1",
  description: "Not a real company 1",
  numEmployees: "3",
  logoUrl: "some-link1",
  // jobs: [fakeJob]
};

const fakeCompany2 = {
  handle: "fake-handle2 ",
  name: "Fake Company 2",
  description: "Not a real company 2",
  numEmployees: "3",
  logoUrl: "some-link2",
  // jobs: [fakeJob]
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
        <CompanyList currentUser={{}} />
      </MemoryRouter>
      , container);
  });
});

it("matches snapshot", async function () {
  await act(async () => {
    render(
      <MemoryRouter>
        <CompanyList currentUser={{}} />
      </MemoryRouter>
      , container);
  });
  expect(container).toMatchSnapshot();
});

it("renders all companies on mount with no search term", async function () {
  const mockGetCompanies =
    jest
      .spyOn(JoblyApi, "getCompanies")
      .mockImplementationOnce(() => Promise.resolve([fakeCompany1, fakeCompany2]));

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <MemoryRouter>
        <CompanyList currentUser={{}} />
      </MemoryRouter>, container);
  });

  expect(mockGetCompanies.mock.calls.length).toEqual(1);

  expect(container).toContainHTML("Fake Company 1");
  expect(container).toContainHTML("Not a real company 1")
  expect(container).toContainHTML("Fake Company 2");
  expect(container).toContainHTML("Not a real company 2")

  // remove the mock to ensure tests are completely isolated
  JoblyApi.getCompanies.mockRestore();
});

it("renders all companies on mount and updates when search form is submitted", async function () {
  const mockGetCompanies =
    jest
      .spyOn(JoblyApi, "getCompanies")
      .mockImplementationOnce(() => Promise.resolve([fakeCompany1, fakeCompany2]))
      .mockImplementationOnce(() => Promise.resolve([fakeCompany2]));

  // render component as is, should show all companies
  await act(async () => {
    render(
      <MemoryRouter>
        <CompanyList currentUser={{}} />
      </MemoryRouter>
      , container);
  });

  expect(mockGetCompanies).toHaveBeenCalledWith("");

  expect(container).toContainHTML("Fake Company 1");
  expect(container).toContainHTML("Fake Company 2");

  // perform a search such that only one of the companies should show up
  const form = container.querySelector(".SearchBar");
  const searchInput = container.querySelector(".SearchBar input");

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: "2" } });
    fireEvent.submit(form);
  });

  expect(mockGetCompanies).toHaveBeenCalledWith("2");
  expect(mockGetCompanies).toHaveBeenCalledTimes(2);

  expect(container).not.toContainHTML("Fake Company 1");
  expect(container).not.toContainHTML("Not a real company 1")
  expect(container).toContainHTML("Fake Company 2");
  expect(container).toContainHTML("Not a real company 2")

  JoblyApi.getCompanies.mockRestore();
});

it("renders all companies, renders none, renders some", async function () {
  const mockGetCompanies =
    jest
      .spyOn(JoblyApi, "getCompanies")
      .mockImplementationOnce(() => Promise.resolve([fakeCompany1, fakeCompany2]))
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve([fakeCompany1]))

  // render component as is, should show all companies
  await act(async () => {
    render(
      <MemoryRouter>
        <CompanyList currentUser={{}} />
      </MemoryRouter>
      , container);
  });

  expect(mockGetCompanies).toHaveBeenCalledWith("");

  expect(container).toContainHTML("Fake Company 1");
  expect(container).toContainHTML("Fake Company 2");

  // perform a search that won't match any companies
  let form = container.querySelector(".SearchBar");
  let searchInput = container.querySelector(".SearchBar input");

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: "none like this" } });
    fireEvent.submit(form);
  });

  expect(mockGetCompanies).toHaveBeenCalledWith("none like this");

  expect(container).not.toContainHTML("Fake Company 1");
  expect(container).not.toContainHTML("Not a real company 1")
  expect(container).toContainHTML("No results found");

  // reselect form and searchbar elements now that component has re-rendered
  form = container.querySelector(".SearchBar");
  searchInput = container.querySelector(".SearchBar input");

  // search again for just a subset of companies
  await act(async () => {
    fireEvent.change(searchInput, { target: { value: "1" } });
    fireEvent.submit(form);
  });

  expect(mockGetCompanies).toHaveBeenCalledWith("1");
  expect(mockGetCompanies).toHaveBeenCalledTimes(3);

  expect(container).toContainHTML("Fake Company 1");
  expect(container).not.toContainHTML("Fake Company 2");
  expect(container).not.toContainHTML("No results found");

  JoblyApi.getCompanies.mockRestore();
});

it("handles errors when fetching data from api", async () => {
  const mockGetCompanies =
    jest
      .spyOn(JoblyApi, "getCompanies")
      .mockImplementationOnce(() => Promise.reject("mock error message"));

  await act(async () => {
    render(
      <MemoryRouter>
        <CompanyList currentUser={{}} />
      </MemoryRouter>
      , container);
  });

  expect(mockGetCompanies.mock.calls.length).toEqual(1);

  // contains error element with message
  const error = container.querySelector(".Error");
  expect(error).toContainHTML("mock error message");

  // doesn't contain any company info
  expect(container).not.toContainHTML("Salary");

  // contains link to go back home
  const redirectLink = container.querySelector("h2");
  expect(redirectLink).toContainHTML("Back to Home");

  JoblyApi.getCompanies.mockRestore();
});