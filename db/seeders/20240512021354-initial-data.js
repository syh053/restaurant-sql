'use strict'

const datas = require('../json/restaurant.json').results

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const newDatas = datas.map(data => {
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
        updatedAt: new Date()
      }
    })

    return await queryInterface.bulkInsert('restaurants', newDatas)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null)
  }
}
