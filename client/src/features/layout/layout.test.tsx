import { describe, it, vi } from "vitest";

vi.mock("@/lib/api");

vi.mock("react-i18next", () => ({
    I18nextProvider: vi.fn(),
    useTranslation: () => {
        return { 
            t: (key: string) => { return key },
            i18n: {
                language: "en"                
            }
        }
    },    
}));

/*
const mockedUseNavigate = vi.fn();
const mockedUseNavigation = vi.fn();
vi.mock(import("react-router-dom"), async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual        
    }
});*/


describe("<Layout />", () => {
	it("renders Layout", () => {
        //render(<MemoryRouter><Layout /></MemoryRouter>);
        //expect(screen.getByTestId('navbar')).toBeInTheDocument();
	});
    

    /*it("check that dark/light mode switcher works", async () => {        
        render(<ChakraProvider><MemoryRouter><Layout /></MemoryRouter></ChakraProvider>);        
        const darkModeButton = screen.getByLabelText(new RegExp("switch to (dark|light) mode", "i"));                
        const newMode = darkModeButton.getAttribute("aria-label")!?.indexOf(" dark") >= 0 ? "dark" : "light";
        act(() => fireEvent.click(darkModeButton));
        await waitFor(() => {
            expect(document.querySelector(`body.chakra-ui-${newMode}`)).not.toBeNull()
        });
    });*/
    
});