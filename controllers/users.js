const service = require("../service");
const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
const { userSchema } = require("../joi");
const gravatar = require("gravatar");
const jimp = require("jimp");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../sendgrid");

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = userSchema.validate({ email, password });
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const user = await User.findOne({ email }, { _id: 1 }).lean(); // "{ _id: 1 }" is a micro-optimization - returns only id - good practice
  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    const newUser = new User({ email, avatarURL, verificationToken });
    await newUser.setPassword(password);
    await newUser.save();
    try {
      await sendMail(email, verificationToken);
    } catch (e) {
      console.log(e);
    }
    res.status(201).json({
      message: "User created",
      user: {
        email,
        subscription: "starter",
      },
    });
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = userSchema.validate({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const user = await User.findOne({ email });
  const isPasswordCorrect = await user.validatePassword(password);

  if (!user || !isPasswordCorrect) {
    return res.status(401).json({ message: "wrong credentials" });
  }

  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
      id: user._id,
    },
  });
};

const currentUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id });
    res.status(200).json({
      message: "You are authorized",
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logoutUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await service.updateUserJWT(_id, null);
    return res.status(204).json({
      status: "No Content",
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const avatarURL = `./avatars/av_${_id}.png`;
  jimp
    .read(`tmp/${req.file.filename}`)
    .then((avatar) => {
      return avatar.resize(250, 250).write(`public/avatars/av_${_id}.png`);
    })
    .catch((e) => {
      console.error(e);
    });
  try {
    const result = await service.updateUserAvatar(_id, avatarURL);
    if (result) {
      fs.unlink(req.file.path, (e) => {
        console.error(e);
      });
      res.status(200).json({ avatarURL });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
};

const listAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const removeUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await service.removeUser(userId);
    res.status(204).json();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const result = await service.updateVerificationToken(verificationToken);
    if (result) {
      res.status(200).json({
        message: "Verification successful",
      });
    } else {
      res.status(404).json({
        message: `User not found`,
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const resendVerificationMail = async (req, res, next) => {
  const { email } = req.body;
  const { error } = userSchema.validate({ email });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      res.status(404).json({
        message: `User not found`,
      });
    } else if (!user.verify) {
      try {
        await sendMail(email, verificationToken);
      } catch (e) {
        console.log(e);
      }
      res.status(200).json({
        message: "Verification email sent",
      });
    } else {
      res.status(400).json({
        message: "Verification has already been passed",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  updateAvatar,
  listAllUsers,
  removeUser,
  verifyUser,
  resendVerificationMail,
};
