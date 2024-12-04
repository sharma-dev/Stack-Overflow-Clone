import mongoose from "mongoose"
import Users from '../models/auth.js'

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.find();
    // console.log(allUsers);
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id} = req.params
  const { name, about, tags } = req.body

  try {
    const updatedProfile = await Users.findByIdAndUpdate(
      _id,
      { $set: { name: name, about : about, tags: tags }},
      { new: true}
    )
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message })
  }
}