import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom';

vi.mock("@/lib/api/api");

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

export const mockedUseNavigate = vi.fn();
export const mockedUseNavigation = vi.fn();

vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
    useNavigation: () => mockedUseNavigation,
  };
});


// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
})