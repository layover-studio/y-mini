import { Hono } from 'hono'
// import { Stripe } from 'stripe'

// import * as PaymentService from "layback/payment";
// import * as EmailService from "layback/email";

const app = new Hono()

// app.post('/', async ctx => {
// 	const STRIPE_SK = ctx.env.STRIPE_SK;
// 	const WEBHOOK_SECRET = ctx.env.WEBHOOK_SECRET;
// 	const body = await ctx.req.text();

// 	const stripe = new Stripe(STRIPE_SK);

// 	const sig = ctx.request.headers.get("stripe-signature");

// 	let event = false;

// 	try {
// 		event = await stripe.webhooks.constructEventAsync(body, sig, WEBHOOK_SECRET);
// 	} catch (err) {
// 		// console.log(err);
// 		throw new Error(`Webhook Error: ${err.message}`);
// 	}

// 	switch (event.type) {
// 		case "checkout.session.completed":
// 			try {
// 				const stripeSession = await stripe.checkout.sessions.retrieve(event.data.object.id)

// 				const paymentSession = await PaymentService.findOneBySessionId({ session_id: stripeSession.id });

// 				if(!paymentSession) {
// 					throw new Error("Payment session not found");
// 				}

// 				await EmailService.sendEmail(
// 					email,
// 					"Payment Confirmed",
// 					`
// 										<h2>Hi ${user.fullname}</h2>
// 										<br>

//                     <h3>Payment Confirmed for ProxyVault</h3>
//                     <p>Thank you for your payment.</p>
//                     <p>Have a nice day!</p>


// 										<br>
// 										<br>

// 										<div>Regards,<br>ProxyVault Team.</div>
//                 `
// 				);
// 				// console.log({ SUCCESS: true });
// 			} catch (err) {
// 				console.log(err);
// 			}

// 			break;
// 		default:
// 			console.log(`Unhandled event type ${event.type}`);
// 	}

//     return ctx.json({
//         ok: true
//     }, 201)
// })

export default app