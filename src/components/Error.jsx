import PropTypes from 'prop-types';

const Error = ({ children, ...props }) => {
  return (
    <div
      style={{ color: "#f23838", textAlign: "center", margin: "0.5rem 0" }}
      {...props}
    >
      {children}
    </div>
  );
};
Error.propTypes = {
    children: PropTypes.any,
    onClickOut: PropTypes.func,
};
export default Error;
