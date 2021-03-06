const mongoose = require("mongoose");
const User = require("../models/User");
const selectFields = require("../helpers/selectFields");
const fs = require("fs");
const uuid = require("uuid").v4;

exports.createUser = async (req, res, next) => {
  const userToCreate = req.body;
  let user = new User(userToCreate);
  try {
    const doc = await user.save();
    console.log("Saved", { doc });
    res.status(200).json({ message: "User successfully created" });
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res
        .status(409)
        .json({ message: "Email Address is already taken" });
    }
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  // just return null if id is not valid, since this is getById method
  const isValid = mongoose.Types.ObjectId.isValid(userId);
  if (!isValid) {
    return res.status(200).json(null);
  }

  try {
    const user = await User.findById(userId).select(selectFields.User);
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.getBillerId = async (req, res, next) => {
  try {
    const billerId = await User.findOne({role: "PortAuthority"}).select("_id");
    res.status(200).json(billerId);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
}

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({
      role: "Customer",
    }).select(selectFields.User);
    res.status(200).json(customers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const userToUpdate = req.body;

  // id param and id in the body must be the same to update the user
  if (userId !== userToUpdate._id) {
    return res.sendStatus(400);
  }

  let user = new User(userToUpdate);
  try {
    const doc = await User.updateOne({ _id: userId }, user);
    // no user matched the userId provided, we return a not found
    if (doc.n < 1) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res
        .status(409)
        .json({ message: "Email Address is already taken" });
    }
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.updatePassword = async (req, res, next) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const { userId } = req.params;
  const { password, newPassword } = req.body;
  try {
    const doc = await User.updateOne(
      { _id: userId, password },
      { password: newPassword }
    );
    console.log(doc);
    if (doc.n < 1) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.authenticateUser = async (req, res, next) => {
  const credentials = req.body;
  const isEmpty = () =>
    !credentials || Object.keys(credentials).every(key => !credentials[key]);

  console.log(credentials);
  try {
    // credentials is empty
    if (isEmpty()) {
      return res.status(404).json({ message: "Invalid Email/Password" });
    }

    const user = await User.findOne({
      email: credentials.email,
      password: credentials.password,
    }).select(selectFields.User);

    // user not found
    if (!user) {
      return res.status(404).json({ message: "Invalid Email/Password" });
    }
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};

exports.uploadPicture = async (req, res, next) => {
  const { userId } = req.params;

  // make sure uploads directory exists
  if (!fs.existsSync(process.env.UPLOADS_DIRECTORY)) {
    fs.mkdirSync(process.env.UPLOADS_DIRECTORY);
  }

  // no file is uploaded, bad request
  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !req.files.profilePicture
  ) {
    return res.status(400).send("No files were uploaded.");
  }

  try {
    // make sure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate unique filename
    const { profilePicture } = req.files;
    const ext = profilePicture.name.split(".").pop();
    const newFilename = `${uuid()}.${ext}`;
    const uploadPath = `${process.env.UPLOADS_DIRECTORY}/${newFilename}`;

    // move the profilePicture to the uploads directory
    profilePicture.mv(uploadPath, async err => {
      if (err) {
        return res.status(500).json(err);
      }

      console.log(user);
      // before we update the profile picture, let's delete the old one that is saved.
      if (user.profilePicture) {
        const oldPicture = `${process.env.UPLOADS_DIRECTORY}/${user.profilePicture}`;
        console.log("DELETE", { oldPicture });
        fs.unlinkSync(oldPicture);
      }

      // update the user's profile picture in db w/ filename
      const doc = await User.updateOne(
        { _id: userId },
        { profilePicture: newFilename }
      );
      console.log(doc);
      if (doc.n < 1) {
        return res.sendStatus(404);
      }
      res.status(200).json({ profilePicture: newFilename });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "There was an error in the database" });
  }
};
