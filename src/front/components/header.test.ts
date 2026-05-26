//Libreries
import {describe, test, expect, beforeEach, vi,} from 'vitest'; 
import { screen } from '@testing-library/dom'; 
import '@testing-library/jest-dom'; 

// Mocks
import { createHeader } from './header';

vi.mock('./base.ts', () => ({ 
    render: (
        selector: string,
        position: InsertPosition,
        template: string,
    ) => {
        const container = document.querySelector(selector);
        container?.insertAdjacentHTML(position, template);
        return container?.firstElementChild;
    },   
}));
describe('Given the Header component', () => {
    describe('When the component is rendered', () => {
        beforeEach(() => {
            // ARRANGE
            document.body.innerHTML = '';
            createHeader();
        });
        describe('Then it should render the main UI elements', () => {
            test('should render the logo, title and button', () => {
                // ARRANGE
                // already prepared in beforeEach

                // ACT
                const logo = screen.getByAltText(
                    'Logo de la empresa',
                );
                const title = screen.getByRole('heading', {
                    name: /productos/i,
                });
                const button = screen.getByRole('button', { //
                    name: /add/i,
                });

                // ASSERT
                expect(logo).toBeInTheDocument();
                expect(title).toBeInTheDocument();
                expect(button).toBeInTheDocument();
            });
        });
        describe('Then the Add button should have the correct accessibility attributes', () => {
            test('should contain the correct aria attributes', () => {
                // ARRANGE
                // already prepared in beforeEach

                // ACT
                const button = screen.getByRole('button', {
                    name: /add/i,
                });

                // ASSERT
                expect(button).toHaveAttribute(
                    'aria-expanded',
                    'false',
                );
                expect(button).toHaveAttribute(
                    'aria-controls',
                    'add', 
                );
            });
        });
    })
})

