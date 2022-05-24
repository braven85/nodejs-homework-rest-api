const service = require("../service");
const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
const { userSchema } = require("../joi");

// =================== REGISTER USER ===================
const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = userSchema.validate({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const user = await User.findOne({ email }, { _id: 1 }).lean();

  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    const newUser = new User({ email });
    await newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      message: "User created",
      data: {
        user: {
          email,
          subscription: "starter",
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

// =================== LOGIN USER ===================
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = userSchema.validate({ email, password });

  if (!error) {
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
      },
    });
  } else {
    return res.status(400).json({ message: error.message });
  }
};

// =================== CURRENT USER ===================
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

// =================== LOGOUT USER ===================
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

module.exports = { registerUser, loginUser, currentUser, logoutUser };
