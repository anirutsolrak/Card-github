import styled from "styled-components";

export const CardFrontRight = styled.div`
    width: 40%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
        margin-bottom: -5px;
    }
    a {
        text-decoration: none;
        color: #fff;
        font-weight: 100;
        font-size: 0.9em;
    }

    span {
        margin-top: 10px;
        font-size: 1rem;
    }
`

export const CardFrontLeft = styled.div`
    border: 1px solid yellow;
    width: 60%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
`