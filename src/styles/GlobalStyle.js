import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    a {
        color: inherit;
        text-decoration: none;
    }

    input, button, select, textarea {
        /* background: none; */
        /* border: none;
        outline: none; */
    }

    button {
        cursor: pointer;
    }
`;