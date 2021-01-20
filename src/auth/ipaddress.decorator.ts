import { createParamDecorator } from '@nestjs/common';

import * as requestIp from 'request-ip';

//Декоратор за взимане на IP адрес
export const IpAddress = createParamDecorator((data, req) => {
	if (req.clientIp)
		return req.clientIp;
	return requestIp.getClientIp(req);
});