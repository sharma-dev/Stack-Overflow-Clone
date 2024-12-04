import Questions from "../models/questions.js";
import auth from "../models/auth.js";
import mongoose from "mongoose";

export const askQuestion = async (req, res) => {
  const postQuestionData = req.body
  const postQuestion = new Questions(postQuestionData)
  const id = req.userId;
  const { count, premium } = await auth.findById(id);
  // console.log(count);
  try {
    if (count < 3 || premium) {
      await postQuestion.save()
      res.status(200).json('success')
      await auth.findByIdAndUpdate(id, { count: count + 1 });
    }
    else {
      res.status(200).json('subs');
    }
  } catch (error) {
    console.log(error)
    res.status(409).json("Couldn't post a new question");
  }
}

export const getAllQuestions = async (req, res) => {
  try {
    const questionList = await Questions.find().sort({ askedOn: -1 });
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  let questionDetail = await Questions.findById(_id);
  
  // console.log(questionDetail);
  // const { count } = await auth.findById(questionDetail.userId);

  // console.log("Before : ", count);
  // await auth.findByIdAndUpdate(questionDetail.userId, { count: count - 1 });

  // let userDetail = await auth.findById(questionDetail.userId);
  // console.log("After : ", userDetail);

  
  try {
    await Questions.findByIdAndRemove(_id);
    res.status(200).json({ message: "Question successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;


  try {
    const question = await Questions.findById(_id);
    /*
    */
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }

      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "Voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "Id not found" });
  }
};