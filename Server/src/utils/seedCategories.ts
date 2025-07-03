// src/utils/seedSkills.ts

import mongoose from "mongoose";
import Skill from "../models/skillModel"
import Category from "../models/categoryModel"

const MONGODB_URI = "mongodb://localhost:27017/Hirexpert";

const seedSkills = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const webDev = await Category.findOne({ name: "Web Development" });
    const design = await Category.findOne({ name: "Design" });
    const videoEdit = await Category.findOne({ name: "Video Editing" });
    const programming = await Category.findOne({ name: "Programming Languages" });

    if (!webDev || !design || !videoEdit || !programming) {
      throw new Error("One or more categories not found. Please seed categories first.");
    }

    const skills = [
      { name: "React", category: webDev._id },
      { name: "Next.js", category: webDev._id },
      { name: "Figma", category: design._id },
      { name: "Adobe XD", category: design._id },
      { name: "Final Cut Pro", category: videoEdit._id },
      { name: "Premiere Pro", category: videoEdit._id },
      { name: "Python", category: programming._id },
      { name: "JavaScript", category: programming._id },
    ];

    await Skill.insertMany(skills);
    console.log("Skills inserted successfully");
  } catch (error) {
    console.error("Error inserting skills:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedSkills();
