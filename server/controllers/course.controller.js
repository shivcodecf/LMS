import { Course } from "../models/course.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "course title and category is required!",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "course Created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to create Course",
    });
  }
};



export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    const sortOptions = {};

    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1;
    }

    if (sortByPrice == "high") {
      sortOptions.coursePrice = -1;
    }

    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      courses: courses || [],
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;

    const courses = await Course.find({ creator: userId });

    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Courses not found",
      });
    }

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to get create Course",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;

    const thumbnail = req.file;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "course not found",
      });
    }
    let courseThumbnail;

    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to edit Course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(401).status({
        message: "Course not found",
        success: false,
      });
    }

    const course = await Course.findById(courseId);

    return res.status(200).json({
      course,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to get  Course",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;

    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required!",
      });
    }

    //  create lecture

    const lecture = await Lecture.create({ lectureTitle }); // stored lecture in Mongodb

    const course = await Course.findById(courseId);

    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to create lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures"); // this code does not return only lecture but return whole course with lecture withu proper title not only id of lecture

    if (!course) {
      return res.status(404).json({
        message: "course not Found",
      });
    }

    return res.status(200).json({
      lectures: course.lectures, // return only lecture here
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to fetch lectures",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course still has the lecture id if it was not aleardy added;
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lectures",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId, courseId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "lecture not found",
      });
    }

    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    await Course.updateOne(
      { lectures: lectureId }, // find the course that contains the lecture
      { $pull: { lectures: lectureId } }, // remove the lectureId from the lectures array (inside course Array)
    );

    return res.status(200).json({
      message: "Lecture removed Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove lecture",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(400).json({
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get lecture",
    });
  }
};

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { publish } = req.query;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({
        message: "course not found",
      });
    }

    course.isPublished = publish === "true";

    await course.save();

    const publishedMessage = course.isPublished ? "Published" : "unPublished";

    return res.status(200).json({
      message: `Course is ${publishedMessage} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const course = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });

    if (!course) {
      return res.status(404).json({
        message: "Course Not found",
      });
    }

    return res.status(200).json({
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to find course",
    });
  }
};
