'use strict'

const bcrypt = require('bcryptjs')

const datas = require('../json/restaurant.json').results

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 使用 transaction，必須要全部執行完成，否則寧願都不要執行;全部執行完 commit，取消執行 rollback
    const t = await queryInterface.sequelize.transaction()

    const hash = bcrypt.hashSync('12345678', 10)

    try {
      await queryInterface.bulkInsert('Users', Array.from({ length: 2 }, (v, i) =>
        ({
          id: i + 1,
          email: `user${i + 1}@example.com`,
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), { transaction: t })

      // 將 restaurant 資料處理成 list
      const newDatas = datas.map(data => {
        // restaurant 的 id 為 1、2、3 的話屬於 user1
        if (data.id <= 3) {
          data.userID = 1
        }

        // restaurant 的 id 為 4、5、6 的話屬於 user2
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

      // 將 restaurant list 塞進 bulkInsert 函數使用
      await queryInterface.bulkInsert('restaurants', newDatas, { transaction: t })

      await t.commit()
    } catch (error) {
      await t.rollback()
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null)
    await queryInterface.bulkDelete('restaurants', null)
  }
}
