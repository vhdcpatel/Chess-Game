const getResponse = (error = null, user = null, token = null) => {
  return {
    user,
    token,
    error,
  };
};

module.exports = getResponse;