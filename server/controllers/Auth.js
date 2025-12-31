import users from "../Modals/Auth.js";

export const login = async (req, res) => {
  const { name, image, email } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      try {
        const newUser = await users.create({ email, name, image });
        return res.status(200).json({ result: newUser });
      } catch (error) {
        res.status(500).json({ message: "something went wrong" });
        return;
      }
    } else {
      res.status(200).json({ result: existingUser });
    }
  } catch (error) {}
  res.status(500).json({ message: "Something went wrong" });
  return;
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ message: "User unavailable..." });
  }
  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname: channelname,
          description: description,
        },
      },
      { new: true }
    );
    return res.status(201).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
