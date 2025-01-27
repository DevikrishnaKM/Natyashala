import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

async function makeThePayment(data: any, orderId: string) {
  // Ensure doctorName, doctorId, fees, and imageUrl are present in data
  const courseName = data.courseName || "Unknown course"; // Fallback to a default value
  const courseId = data.courseId || "Unknown course ID"; // Fallback to a default value
  const amount = data.amount || 0; // Ensure there's a valid amount
  
  // Build line items
  const line_items = [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: courseName,
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:5173/confirmPayment/${encodeURIComponent(orderId)}/${encodeURIComponent(courseId)}`,
      cancel_url: `http://localhost:5173/paymentFailed`,
      line_items: line_items,
      mode: "payment",
    });
    console.log("url session:",session)

    return session;
  } catch (error: any) {
    console.log("Error in payment", error);
    throw new Error(`Payment failed: ${error.message}`);
  }
}
export default makeThePayment