import Banner from "../assets/Banner.jpg";
import styled from "styled-components";

const Header = () => {
  return (
    <HeaderContainer>
      <Image src={Banner} />
      <Demo>
        <>boo</>
      </Demo>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  position: relative;
  height: 15vh;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0.5;
  height: 15vh;
`;

const Demo = styled.div`
  position: relative;
`;
