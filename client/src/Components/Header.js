const Header = () => {
  const handleSignIn = () => {
    fetch("/createUser")
      .then((res) => res.json())
      .then((resData) => console.log(resData));
  };

  return (
    <>
      <button onClick={() => handleSignIn()}>Signin</button>
    </>
  );
};

export default Header;
