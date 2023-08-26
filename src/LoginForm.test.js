import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from "react-router-dom";
import LoginForm from './LoginForm';

import { fireEvent } from '@testing-library/react';


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
        <LoginForm logIn={() => { }} />
      </MemoryRouter>
      , container);
  });
});

it("matches snapshot", async function () {
  await act(async () => {
    render(
      <MemoryRouter>
        <LoginForm logIn={() => { }} />
      </MemoryRouter>
      , container);
  });
  expect(container).toMatchSnapshot();
});

it("renders empty form successfully", async function () {

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <MemoryRouter>
        <LoginForm logIn={() => { }} />
      </MemoryRouter>
      , container);
  });

  const usernameInput = container.querySelector("#LoginForm-username");
  const passwordInput = container.querySelector("#LoginForm-password");

  expect(container).toContainHTML("<h3>Log in</h3>");
  expect(container).toContainElement(usernameInput);
  expect(container).toContainElement(passwordInput);

});

it("calls prop function upon submission", async function () {
  const mockLogIn = jest.fn();

  await act(async () => {
    render(
      <MemoryRouter>
        <LoginForm logIn={mockLogIn} />
      </MemoryRouter>
      , container);
  });

  const form = container.querySelector("form");
  const usernameInput = container.querySelector("#LoginForm-username");
  const passwordInput = container.querySelector("#LoginForm-password");

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "test-username" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    fireEvent.submit(form);
  });

  expect(mockLogIn).toHaveBeenCalledWith(
    { username: "test-username", password: "test-password" }
  );
  expect(mockLogIn).toBeCalledTimes(1);

  mockLogIn.mockRestore();
});

it("shows errors when submission function throws them", async function () {
  const mockLogIn = jest
    .fn()
    .mockImplementationOnce(() => Promise.reject(["mock error message"]));

  await act(async () => {
    render(
      <MemoryRouter>
        <LoginForm logIn={mockLogIn} />
      </MemoryRouter>
      , container);
  });

  const form = container.querySelector("form");
  const usernameInput = container.querySelector("#LoginForm-username");
  const passwordInput = container.querySelector("#LoginForm-password");

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "test-username" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    fireEvent.submit(form);
  });

  expect(mockLogIn).toHaveBeenCalledWith(
    { username: "test-username", password: "test-password" }
  );
  expect(mockLogIn).toBeCalledTimes(1);

  // shows errors
  const error = container.querySelector(".Error");
  expect(error).toContainHTML("mock error message");
  expect(container).toContainElement(error);

  // holds onto initial inputs in form
  expect(usernameInput).toContainHTML("test-username");

  mockLogIn.mockRestore();
});


it("can resubmit form when errors are present", async function () {
  const mockLogIn = jest
    .fn()
    .mockImplementationOnce(() => Promise.reject(["mock error message"]));

  await act(async () => {
    render(
      <MemoryRouter>
        <LoginForm logIn={mockLogIn} />
      </MemoryRouter>
      , container);
  });

  const form = container.querySelector("form");
  const usernameInput = container.querySelector("#LoginForm-username");
  const passwordInput = container.querySelector("#LoginForm-password");

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "test-username" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    fireEvent.submit(form);
  });

  expect(mockLogIn).toHaveBeenCalledWith(
    { username: "test-username", password: "test-password" }
  );
  expect(mockLogIn).toBeCalledTimes(1);

  // shows errors
  const error = container.querySelector(".Error");
  expect(error).toContainHTML("mock error message");
  expect(container).toContainElement(error);

  // type in new inputs and resubmit form
  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "new-username2" } });
    fireEvent.change(passwordInput, { target: { value: "new-password2" } });
    fireEvent.submit(form);
  });

  expect(mockLogIn).toHaveBeenCalledWith(
    { username: "new-username2", password: "new-password2" }
  );
  expect(mockLogIn).toBeCalledTimes(2);

  mockLogIn.mockRestore();
});
