import  { keyframes } from "styled-components";


const slideInTop = keyframes`
  from {
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
    visibility: visible;
  }

  to {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
const slideOutTop = keyframes`
  from {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
  }
`;

const slideInBottom = keyframes`
  from {
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
  }

  to {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const slideOutBottom = keyframes`
  from {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
  }
`;

// const PageContainer = styled.div`
//   position: relative;
//   width: 60vw;
//   height: 100vh;
// `;

// const Page = styled.div`
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   top: 0;
//   left: 0;
//   h2 {
//     color: #0d47a1;
//   }
//   p {
//     font-size: 1rem;
//     max-width: 400px;
//     margin: 20px auto;
//     color: #37474f;
//   }

//   }

//   img {
//     border-radius: 50%;
//   }
// `;

export const AddPage = "nothing";

export const DefaultPage = "nothing";

