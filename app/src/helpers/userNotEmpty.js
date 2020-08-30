const userNotEmpty = user => {
  return user && Object.keys(user).every(key => !!user[key]);
};

export { userNotEmpty };
