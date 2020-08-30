db.createUser({
  user: "riza",
  pwd: "riza123",
  roles: [
    {
      role: "readWrite",
      db: "rizadb",
    },
  ],
});
