import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/utils/conn/mongoose'
import User from '@/lib/utils/models/userModel'
import bcrypt from 'bcrypt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'POST':
      try {
        let username = req.query.username;
        let type = req.query.type;
        const user = await User.findOne({username: username})
        if (type === 'username') {
          let newUsername = req.body.newUsername;
          const exist = await User.findOne({username: newUsername})
          if (exist) {
            res.send('Username Exists Please Choose another')
          } else {
            user.usernmae = newUsername
            const data = await user.save();
            if (data) {
              res.redirect('/profile')
            } else {
              res.send('Error saving data')
            }
          }
        } else if (type === 'details') {
          let firstname = req.body.firstname;
          let lastname = req.body.lastname;
          let sfirstname = req.body.sfirstname;
          let slastname = req.body.slastname;
          user.firstname = firstname;
          user.lastname = lastname;
          user.sfirstname = sfirstname;
          user.slastname = slastname;
          const data = await user.save();
          if (data) {
            res.redirect('/profile')
          } else {
            res.send('Error updating profile details')
          }
        } else if (type === 'account') {
          let array = user.account
          let accType = req.query.array
          if (array.includes(accType)) {
            res.send('Type already exists')
          } else {
            array.push(accType)
            user.account = array
            const data = await user.save()
            if (data) {
              res.redirect('/profile')
            } else {
              res.send('Error saving data')
            }
          }
        } else if (type === 'accountRem') {
          let accType = req.query.array
          let array = user.account
          if (array.includes(accType)) {
            let index = array.indexOf(accType)
            array.splice(index, 1)
            user.account = array
            const data = await user.save()
            if (data) {
              res.redirect('/profile')
            } else {
              res.send('Error removing acount type')
            }
          } else {
            res.send(`Couldn't found account type`)
          }
        } else if (type === 'password') {
          let oldpass = req.body.oldpass
          if (bcrypt.compareSync(oldpass || "", user.password)) {
            let newpass = req.body.newpass
            let confirmpass = req.body.confirmpass
            if (newpass === confirmpass) {
              let hasPass = bcrypt.hashSync(newpass, 12)
              user.password = hasPass
              const data = await user.save()
              if (data) {
                res.redirect('/profile')
              } else {
                res.send('Error saving password')
              }
            } else {
              res.send(`Didn't match both password`)
            }
          }
        }
      } catch (error) {
        res.send(error)
      }
      break
    default:
      console.log(method)
      res.status(400).json({ success: false })
      break
  }
}