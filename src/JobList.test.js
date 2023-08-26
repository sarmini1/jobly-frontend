import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { screen } from '@testing-library/react';
import JobList from './JobList';

import JoblyApi from './api';
import { fireEvent } from '@testing-library/react';

const fakeUser = {
  applications: new Set()
};

const fakeJob1 = {
  id: 5,
  title: "Fake job title1",
  salary: 100,
  equity: "0.5",
  companyHandle: "fake-handle1",
  companyName: "Fake Company 1"
};

const fakeJob2 = {
  id: 6,
  title: "Fake job title2",
  salary: 200,
  equity: "0.5",
  companyHandle: "fake-handle2",
  companyName: "Fake Company 2"
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
        <JobList currentUser={{}} addJobApp={() => { }} />
      </MemoryRouter>
      , container);
  });
});

it("matches snapshot", async function () {
  await act(async () => {
    render(
      <MemoryRouter>
        <JobList currentUser={{}} addJobApp={() => { }} />
      </MemoryRouter>
      , container);
  });
  expect(container).toMatchSnapshot();
});

it("renders all companies on mount with no search term", async function () {
  const mockGetJobs =
    jest
      .spyOn(JoblyApi, "getJobs")
      .mockImplementationOnce(() => Promise.resolve([fakeJob1, fakeJob2]));

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <MemoryRouter>
        <JobList currentUser={fakeUser} addJobApp={() => { }} />
      </MemoryRouter>
      , container);
  });

  expect(mockGetJobs.mock.calls.length).toEqual(1);

  expect(container).toContainHTML("Fake Company 1");
  expect(container).toContainHTML("Fake job title1");
  expect(container).toContainHTML("Fake Company 2");
  expect(container).toContainHTML("Fake job title2");

  // remove the mock to ensure tests are completely isolated
  JoblyApi.getJobs.mockRestore();
});

it("renders all companies on mount and updates when search form is submitted", async function () {
  const mockGetJobs =
    jest
      .spyOn(JoblyApi, "getJobs")
      .mockImplementationOnce(() => Promise.resolve([fakeJob1, fakeJob2]))
      .mockImplementationOnce(() => Promise.resolve([fakeJob2]));

  // render component as is, should show all companies
  await act(async () => {
    render(
      <MemoryRouter>
        <JobList currentUser={fakeUser} addJobApp={() => { }} />
      </MemoryRouter>
      , container);
  });

  expect(mockGetJobs.mock.calls.length).toEqual(1);

  expect(container).toContainHTML("Fake Company 1");
  expect(container).toContainHTML("Fake job title1");
  expect(container).toContainHTML("Fake Company 2");
  expect(container).toContainHTML("Fake job title2");

  // perform a search such that only one of the companies should show up
  const form = container.querySelector(".SearchBar");
  const searchInput = container.querySelector(".SearchBar input");

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: "2" } });
    fireEvent.submit(form);
  });

  expect(mockGetJobs).toHaveBeenCalledWith("2");
  expect(mockGetJobs).toHaveBeenCalledTimes(2);

  expect(container).not.toContainHTML("Fake job title1");
  expect(container).not.toContainHTML("Fake Company 1");
  expect(container).toContainHTML("Fake Company 2");
  expect(container).toContainHTML("Fake job title2");

  JoblyApi.getJobs.mockRestore();
});

it("renders all companies, renders none, renders some", async function () {
  const mockGetJobs =
    jest
      .spyOn(JoblyApi, "getJobs")
      .mockImplementationOnce(() => Promise.resolve([fakeJob1, fakeJob2]))
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve([fakeJob2]));

  // render component as is, should show all companies
  await act(async () => {
    render(
      <MemoryRouter>
        <JobList currentUser={fakeUser} addJobApp={() => { }} />
      </MemoryRouter>
      , container);
  });

  expect(mockGetJobs).toHaveBeenCalledWith("");

  expect(container).toContainHTML("Fake Company 1");
  expect(container).toContainHTML("Fake job title1");
  expect(container).toContainHTML("Fake job title2");
  expect(container).toContainHTML("Fake Company 2");

  // perform a search that won't match any companies
  let form = container.querySelector(".SearchBar");
  let searchInput = container.querySelector(".SearchBar input");

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: "none like this" } });
    fireEvent.submit(form);
  });

  expect(mockGetJobs).toHaveBeenCalledWith("none like this");

  expect(container).not.toContainHTML("Fake job title1");
  expect(container).not.toContainHTML("Fake job title2");
  expect(container).toContainHTML("No results found");

  // reselect form and searchbar elements now that component has re-rendered
  form = container.querySelector(".SearchBar");
  searchInput = container.querySelector(".SearchBar input");

  // search again for just a subset of companies
  await act(async () => {
    fireEvent.change(searchInput, { target: { value: "2" } });
    fireEvent.submit(form);
  });

  expect(mockGetJobs).toHaveBeenCalledWith("2");
  expect(mockGetJobs).toHaveBeenCalledTimes(3);

  expect(container).toContainHTML("Fake Company 2");
  expect(container).not.toContainHTML("Fake Company 1");
  expect(container).not.toContainHTML("No results found");

  JoblyApi.getJobs.mockRestore();
});

it("handles errors when fetching data from api", async () => {
  const mockGetJobs =
    jest
      .spyOn(JoblyApi, "getJobs")
      .mockImplementationOnce(() => Promise.reject("mock error message"));

  await act(async () => {
    render(
      <MemoryRouter>
        <JobList currentUser={fakeUser} addJobApp={() => { }} />
      </MemoryRouter>
      , container);
  });

  expect(mockGetJobs.mock.calls.length).toEqual(1);

  // contains error element with message
  const error = container.querySelector(".Error");
  expect(error).toContainHTML("mock error message");

  // doesn't contain any job info
  expect(container).not.toContainHTML("Fake job title1");

  JoblyApi.getJobs.mockRestore();
});