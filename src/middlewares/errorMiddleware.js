module.exports = (error, req, res, next) => {
  if(error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};
