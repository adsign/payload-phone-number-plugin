import type { Payload } from 'payload';

import { devUser } from './helpers/credentials.js';

export const seed = async (payload: Payload) => {
    const { totalDocs: totalUsers } = await payload.count({
        collection: 'users',
        where: {
            email: {
                equals: devUser.email,
            },
        },
    });

    if (!totalUsers) {
        await payload.create({
            collection: 'users',
            data: devUser,
        });
    }

    const employeeName = 'John Doe';

    // test number
    const phoneNumber = '+4740612345';

    const { totalDocs: totalEmployees } = await payload.count({
        collection: 'employees',
        where: {
            name: {
                equals: employeeName,
            },
        },
    });

    if (!totalEmployees) {
        await payload.create({
            collection: 'employees',
            data: {
                name: employeeName,
                phoneNumber,
            },
        });
    }
};
