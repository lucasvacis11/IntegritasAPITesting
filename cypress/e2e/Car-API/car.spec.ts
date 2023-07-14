describe('Car Rental Service', () => {

    let testData;

    before(() => {
        cy.fixture('reservation.json').then((data) => {
            testData = data;
        });
    });

    it('POST - create a reservation', () => {
        cy.request({
            method: 'POST',
            url: '/api/reservations',
            body: testData.validPayload,
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.carId).to.eq(testData.validPayload.carId);
            expect(response.body.customerName).to.eq(testData.validPayload.customerName);
            expect(response.body.startDate).to.eq(testData.validPayload.startDate);
            expect(response.body.endDate).to.eq(testData.validPayload.endDate);
        });
    });

    it('POST - Validate response format', () => {
        cy.request({
            method: 'POST',
            url: '/api/reservations',
            body: testData.validPayload,
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.exist;
            expect(response.body).to.have.all.keys('reservationId', 'carId', 'startDate', 'endDate', 'customerName');
            expect(response.body.reservationId).to.be.a('string');
            expect(response.body.carId).to.be.a('string');
            expect(response.body.startDate).to.be.a('string');
            expect(response.body.endDate).to.be.a('string');
            expect(response.body.customerName).to.be.a('string');
        });
    });

    it('GET - retrieve a reservation', () => {
        cy.request({
            method: 'POST',
            url: '/api/reservations',
            body: testData.validPayload,
        }).then((response) => {
            testData.validPayload.reservationId = response.body.reservationId;
        });

        cy.request({
            method: 'GET',
            url: `/api/reservations/${testData.validPayload.reservationId}`,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.carId).to.eq(testData.validPayload.carId);
            expect(response.body.customerName).to.eq(testData.validPayload.customerName);
            expect(response.body.startDate).to.eq(testData.validPayload.startDate);
            expect(response.body.endDate).to.eq(testData.validPayload.endDate);
        });
    });

    it('DELETE - cancel a reservation', () => {
        cy.request({
            method: 'POST',
            url: '/api/reservations',
            body: testData.validPayload,
        }).then((response) => {
            testData.validPayload.reservationId = response.body.reservationId;
        });

        cy.request({
            method: 'DELETE',
            url: `/api/reservations/${testData.validPayload.reservationId}`,
        }).then((response) => {
            expect(response.status).to.eq(204);
        });

        cy.request({
            method: 'GET',
            url: `/api/reservations/${testData.validPayload.reservationId}`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    it('Successful reservation', () => {
        cy.request({
            method: 'POST',
            url: '/api/reservations',
            body: testData.validPayload
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.exist;
            testData.validPayload.reservationId = response.body.reservationId;
            expect(response.body.carId).to.eq(testData.validPayload.carId);
            expect(response.body.customerName).to.eq(testData.validPayload.customerName);
            expect(response.body.startDate).to.eq(testData.validPayload.startDate);
            expect(response.body.endDate).to.eq(testData.validPayload.endDate);
        }).then(() => {
            cy.request({
                method: 'GET',
                url: `/api/reservations/${testData.validPayload.reservationId}`
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.deep.equal(testData.validPayload)
            });

            cy.request({
                method: 'DELETE',
                url: `/api/reservations/${testData.validPayload.reservationId}`,
            }).then((response) => {
                expect(response.status).to.eq(204);
                expect(response.body).to.be.empty
            });
        });
    });

    it('POST - Bad request reservation - dates reversed', () => {
        const invalidPayloadDatesReversed = {
            ...testData.validPayload,
            startDate: testData.validPayload.endDate,
            endDate: testData.validPayload.startDate,
        };
        cy.request({
            method: 'POST',
            url: '/api/reservations',
            body: invalidPayloadDatesReversed,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('message', 'Expected error message')
        });
    });

    it('POST - Bad request reservation - non-existent carId', () => {
        const invalidPayloadNonexistentCar = {
            ...testData.validPayload,
            carId: 'ThisCarIDNotExist',
        };
        cy.request({
            method: 'POST',
            url: '/api/reservations',
            body: invalidPayloadNonexistentCar,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('message', 'Expected error message')
        });
    });

    it('POST - Bad request reservation - invalid format', () => {
        cy.request({
            method: 'POST',
            url: '/api/reservations',
            body: testData.invalidPayload,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('message', 'Expected error message')
        });
    });

    it('GET - retrieve reservation not found', () => {
        cy.request({
            method: 'GET',
            url: `/api/reservations/1234567890`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('message', 'NOT_FOUND')
        });
    });

    it('DELETE - cancel reservation not found', () => {
        cy.request({
            method: 'DELETE',
            url: `/api/reservations/1234567890`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('message', 'NOT_FOUND')
        });
    })
});
