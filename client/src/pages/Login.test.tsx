import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

jest.mock("../net/api");

jest.mock("react-i18next", () => ({
    I18nextProvider: jest.fn(),    
    useTranslation: () => ({ t: (key: string) => { return key } }),
}));

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedUseNavigate,
}));

describe("<Login />", () => {
    it("renders Login page", async () => {              
        const { container } = render(<MemoryRouter><Login /></MemoryRouter>);
        const loginInput = container.querySelector("#login");
        const passwordInput = container.querySelector("#password");
        const button = await screen.getByRole("button");
        expect(loginInput).not.toBeNull();
        expect(passwordInput).not.toBeNull();
        expect(button).not.toBeNull();
    });

    it("shows a login error on other than 401 error", async () => {              
        const { container } = render(<MemoryRouter><Login /></MemoryRouter>);
        const loginInput = container.querySelector("#login");
        const passwordInput = container.querySelector("#password");
        const button = await screen.getByRole("button");
        
        await act(() => { fireEvent.click(button) });
        const error = await screen.getByText("Message.LoginError");
        expect(error).not.toBeNull();
    });

    it("shows a credentials error on wrong credentials", async () => {              
        const { container } = render(<MemoryRouter><Login /></MemoryRouter>);
        const loginInput = container.querySelector("#login");
        const passwordInput = container.querySelector("#password");
        const button = await screen.getByRole("button");
        
        fireEvent.change(loginInput as Element, { target: { value: 'test' } });
        fireEvent.change(passwordInput as Element, { target: { value: 'test' } });
        await act(() => { fireEvent.click(button) });
        const error = await screen.getByText("Message.LoginErrorWrongCredentials");
        expect(error).not.toBeNull();
    });

    it("logins user on correct credentials", async () => {              
        const { container } = render(<MemoryRouter><Login /></MemoryRouter>);
        const loginInput = container.querySelector("#login");
        const passwordInput = container.querySelector("#password");
        const button = await screen.getByRole("button");
        
        fireEvent.change(loginInput as Element, { target: { value: 'user1' } });
        fireEvent.change(passwordInput as Element, { target: { value: 'password1' } });
        await act(() => { fireEvent.click(button) });        
        await waitFor(() => {
            expect(mockedUseNavigate).toHaveBeenCalledWith(document.location.pathname + document.location.search);
            expect(useAuthStore.getState().isLoggedIn).toEqual(true);
            expect(useAuthStore.getState().getUserName()).toEqual("user1");
        });        
    });
});