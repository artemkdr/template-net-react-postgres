import { Layout } from "@/features/layout/layout";
import { ChakraProvider } from "@chakra-ui/react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it } from "vitest";


const mockedAuthContext = { isLoggedIn: false, username: null };

describe("<Layout />", () => {
	it("renders Layout", () => {
        render(<ChakraProvider><MemoryRouter><Layout authContext={mockedAuthContext} /></MemoryRouter></ChakraProvider>);
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
	});
    

    it("check that dark/light mode switcher works", async () => {        
        render(<ChakraProvider><MemoryRouter><Layout authContext={mockedAuthContext} /></MemoryRouter></ChakraProvider>);        
        const darkModeButton = screen.getByLabelText(new RegExp("switch to (dark|light) mode", "i"));                
        const newMode = darkModeButton.getAttribute("aria-label")!?.indexOf(" dark") >= 0 ? "dark" : "light";
        act(() => fireEvent.click(darkModeButton));
        await waitFor(() => {
            expect(document.querySelector(`body.chakra-ui-${newMode}`)).not.toBeNull()
        });
    });
    
});