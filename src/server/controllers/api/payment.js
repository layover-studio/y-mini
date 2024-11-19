import { Hono } from 'hono'

const app = new Hono()

import * as PaymentService from "../../services/payment.js";
import * as UserService from "../../services/user.js";
// import * as OrganizationService from "../../services/Organization.js";

app.post('/sessions', async ctx => {
    const currentUser = await UserService.findOneById(ctx.data.session.userId);

    const paymentSession = await PaymentService.create({
        user: currentUser
    });

	return ctx.json({
		ok: true,
        session_url: paymentSession.session_url
	});
})

export default app