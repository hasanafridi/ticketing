import buildClient from "../api/build-client";

const Landing = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

Landing.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client
    .get("/api/users/currentuser")
    .catch((err) => console.log(err.message));
  return data;
};

export default Landing;
