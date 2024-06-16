'use strict'

const datas = require('../json/restaurant.json').results

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const t = await queryInterface.sequelize.transaction()

    try {    

      await queryInterface.bulkInsert('Users', Array.from({ length: 2 }, ( v, i ) =>
        ({
          id: i + 1,
          email: `user${i + 1}@example.com`,
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), { transaction: t })

      const newDatas = datas.map(data => {

        if (data.id <= 3) {
          data.userID = 1
        }

        if (data.id > 3 && data.id <= 6) {
          data.userID = 2
        }

        return {
          id: data.id,
          name: data.name,
          name_en: data.name_en,
          category: data.category,
          image: data.image,
          location: data.location,
          phone: data.phone,
          google_map: data.google_map,
          rating: data.rating,
          description: data.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          userID: data.userID
        }
      })

      await queryInterface.bulkInsert('restaurants', newDatas, { transaction: t })

      await t.commit()

    } catch (error) {

      await t.rollback()

    }

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null)
    await queryInterface.bulkDelete('restaurants', null)
  }
}
