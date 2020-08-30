const toFullName = user => {
  return `${user?.firstName} ${user?.lastName}`;
};

export { toFullName };
