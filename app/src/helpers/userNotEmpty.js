const userNotEmpty = userData => {
  // remove profilePicture property, because of bug with login
  // when it's check in the 'every' function below, it results to false
  // but we need to be set to default
  // so we just dont include it in the check to determine if user is not empty
  const user = {
    ...userData
  };
  delete user.profilePicture;

  return userData && Object.keys(user).every(key => !!user[key]);
};

export { userNotEmpty };
