import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";
import { Lecture } from "../models/lecture.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ("When a user clicks buy, the frontend calls the backend to create a Stripe checkout session. The backend creates a pending purchase and sends session details including metadata like userId and courseId to Stripe. Stripe returns a checkout URL, which the frontend uses to redirect the user to Stripe’s payment page. After successful payment, Stripe sends a webhook event to our backend. We verify the event, update the purchase status to completed, and grant access to the course by updating user and course records. This ensures secure and reliable payment handling.");

// this controllers calls the stripe to open the stripe sessions to enter users details

const apiUrl = process.env.FRONTEND_URL;


export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // here the main stripe is invoked in frontend (backend calls stripe for sessions)
    // here we verify with stripe official documentation

    

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${apiUrl}/course-progress/${courseId}`,
      cancel_url: `${apiUrl}/course-detail/${courseId}`,
      //"Metadata in Stripe is used to attach custom information like userId and courseId so we can identify and process the payment correctly in the webhook."
      metadata: {
        courseId,
        userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    if (!session.url) {
      return res.status(400).json({
        success: false,
        message: "Error while creating Stripe session",
      });
    }

    // store paymentId , so we can match sessions after successful payment
    //You can match payment → user → course

    newPurchase.paymentId = session.id;

    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("❌ createCheckoutSession error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//

// This controller listens to Stripe events and confirms payment after it actually succeeds.
//Webhook is an automatic HTTP callback triggered by an event.



export const stripeWebhook = async (req, res) => {
  const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    //It verifies that the webhook request actually came from Stripe and is not fake.
    // “Was this request really signed by Stripe?”
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

  } catch (error) {
    console.error(
      "❌ Stripe webhook signature verification failed:",
      error.message,
    );
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("✅ Stripe event: checkout.session.completed");

    const session = event.data.object;

    try {
      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate("courseId");

      if (!purchase) {
        console.warn("⚠️ No matching purchase for session ID:", session.id);
        return res.status(404).send("Purchase not found");
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      purchase.status = "completed";
      await purchase.save();

      // Make lectures visible
      if (purchase.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } },
        );
      }

      // Add course to user's enrolled list
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true },
      );

      // Add user to course's student list
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true },
      );

      console.log("✅ Purchase completed and user/course updated");
    } catch (err) {
      console.error("❌ Error processing webhook session:", err);
      return res.status(500).send("Server error");
    }
  }

  res.status(200).send();
};



export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course Not found" });
    }

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.error("❌ getCourseDetail error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};





export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourses = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    return res.status(200).json({
      purchasedCourse: purchasedCourses || [],
    });
  } catch (error) {
    console.error("❌ getAllPurchasedCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
