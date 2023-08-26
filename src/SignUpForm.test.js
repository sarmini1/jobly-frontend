import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from "react-router-dom";
import SignUpForm from './SignUpForm';

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
        <SignUpForm signUp={() => { }} />
      </MemoryRouter>
      , container);
  });
});

it("matches snapshot", async function () {
  await act(async () => {
    render(
      <MemoryRouter>
        <SignUpForm signUp={() => { }} />
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
        <SignUpForm signUp={() => { }} />
      </MemoryRouter>
      , container);
  });

  const form = container.querySelector("form");
  const usernameInput = container.querySelector("#signUpForm-username");
  const passwordInput = container.querySelector("#signUpForm-password");
  const firstNameInput = container.querySelector("#signUpForm-first-name");
  const lasttNameInput = container.querySelector("#signUpForm-last-name");
  const emailInput = container.querySelector("#signUpForm-email");

  expect(container).toContainHTML("<h3>Sign Up</h3>");
  expect(container).toContainElement(form);
  expect(container).toContainElement(usernameInput);
  expect(container).toContainElement(passwordInput);
  expect(container).toContainElement(firstNameInput);
  expect(container).toContainElement(lasttNameInput);
  expect(container).toContainElement(emailInput);
});

it("calls prop function upon submission", async function () {
  const mockSignUp = jest.fn();

  await act(async () => {
    render(
      <MemoryRouter>
        <SignUpForm signUp={mockSignUp} />
      </MemoryRouter>
      , container);
  });

  const form = container.querySelector("form");
  const usernameInput = container.querySelector("#signUpForm-username");
  const passwordInput = container.querySelector("#signUpForm-password");
  const firstNameInput = container.querySelector("#signUpForm-first-name");
  const lasttNameInput = container.querySelector("#signUpForm-last-name");
  const emailInput = container.querySelector("#signUpForm-email");

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "test-username" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    fireEvent.change(firstNameInput, { target: { value: "test-first-name" } });
    fireEvent.change(lasttNameInput, { target: { value: "test-last-name" } });
    fireEvent.change(emailInput, { target: { value: "test-email" } });
    fireEvent.submit(form);
  });

  expect(mockSignUp).toHaveBeenCalledWith(
    {
      username: "test-username",
      password: "test-password",
      firstName: "test-first-name",
      lastName: "test-last-name",
      email: "test-email"
    }
  );
  expect(mockSignUp).toBeCalledTimes(1);

  mockSignUp.mockRestore();
});

it("shows errors when submission function throws them", async function () {
  const mockSignUp = jest
    .fn()
    .mockImplementationOnce(() => Promise.reject(["mock error message"]));

  await act(async () => {
    render(
      <MemoryRouter>
        <SignUpForm signUp={mockSignUp} />
      </MemoryRouter>
      , container);
  });

  const form = container.querySelector("form");
  const usernameInput = container.querySelector("#signUpForm-username");
  const passwordInput = container.querySelector("#signUpForm-password");
  const firstNameInput = container.querySelector("#signUpForm-first-name");
  const lasttNameInput = container.querySelector("#signUpForm-last-name");
  const emailInput = container.querySelector("#signUpForm-email");

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "test-username" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    fireEvent.change(firstNameInput, { target: { value: "test-first-name" } });
    fireEvent.change(lasttNameInput, { target: { value: "test-last-name" } });
    fireEvent.change(emailInput, { target: { value: "test-email" } });
    fireEvent.submit(form);
  });

  expect(mockSignUp).toHaveBeenCalledWith(
    {
      username: "test-username",
      password: "test-password",
      firstName: "test-first-name",
      lastName: "test-last-name",
      email: "test-email"
    }
  );
  expect(mockSignUp).toBeCalledTimes(1);

  // shows errors
  const error = container.querySelector(".Error");
  expect(error).toContainHTML("mock error message");
  expect(container).toContainElement(error);

  // holds onto initial inputs in form
  expect(usernameInput).toContainHTML("test-username");

  mockSignUp.mockRestore();
});

it("can resubmit form when errors are present", async function () {
  const mockSignUp = jest
    .fn()
    .mockImplementationOnce(() => Promise.reject(["mock error message"]));

  await act(async () => {
    render(
      <MemoryRouter>
        <SignUpForm signUp={mockSignUp} />
      </MemoryRouter>
      , container);
  });

  const form = container.querySelector("form");
  const usernameInput = container.querySelector("#signUpForm-username");
  const passwordInput = container.querySelector("#signUpForm-password");
  const firstNameInput = container.querySelector("#signUpForm-first-name");
  const lasttNameInput = container.querySelector("#signUpForm-last-name");
  const emailInput = container.querySelector("#signUpForm-email");

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "test-username" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    fireEvent.change(firstNameInput, { target: { value: "test-first-name" } });
    fireEvent.change(lasttNameInput, { target: { value: "test-last-name" } });
    fireEvent.change(emailInput, { target: { value: "test-email" } });
    fireEvent.submit(form);
  });

  // shows errors
  const error = container.querySelector(".Error");
  expect(error).toContainHTML("mock error message");
  expect(container).toContainElement(error);

  // update some inputs and resubmit form
  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "new-username2" } });
    fireEvent.change(passwordInput, { target: { value: "new-password2" } });
    fireEvent.submit(form);
  });

  expect(mockSignUp).toHaveBeenCalledWith(
    {
      username: "new-username2",
      password: "new-password2",
      firstName: "test-first-name",
      lastName: "test-last-name",
      email: "test-email"
    }
  );
  expect(mockSignUp).toBeCalledTimes(2);

  mockSignUp.mockRestore();
});
