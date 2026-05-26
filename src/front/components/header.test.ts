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
    })
})

