const Header = () => {
  const handleSignIn = () => {
    const data = {
      user: "Marco",
    };

    fetch("/createUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resData) => console.log(resData));

    console.log("Done");
  };

  return (
    <>
      <button onClick={() => handleSignIn()}>Signin</button>
    </>
  );
};

export default Header;
