const router = require('express').Router()
const { Stock, Portfolio } = require('../db/models')
module.exports = router

router.param('id', (req, res, next, id) => {
  Portfolio.findById(id)
    .then(portfolio => {
      req.portfolio = portfolio
      next()
      return null
    })
    .catch(next)
})

router.get('/', (req, res, next) => {
  Portfolio.findAll()
    .then(portfolio => res.json(portfolio))
    .catch(next)
})

router.get('/session', (req, res, next) => {
  if (req.user) {
    Portfolio.findOne({
      where: {
        userId: req.user.id,
        status: open
      }
    })
      .then(foundPortfolio => {
        if (foundPortfolio) req.session.portfolio = foundPortfolio
        res.send(req.session.portfolio)
      })
      .catch(next)
  } else res.send(req.session.portfolio)
})

router.delete('/session', (req, res, next) => {
  req.session.portfolio = []
  res.send(req.session.portfolio)
})

router.post('/', (req, res, next) => {
  if (req.body.userId) {
    Portfolio.findOrCreate({
      where: {
        userId: req.body.userId,
        status: 'open'
      }
    })
      .spread((portfolio, createdPortfolioBool) =>
        Stock.create(req.body).then(stock => stock.setPortfolio(portfolio))
      )
      .then(stock => {
        req.session.portfolio.push(stock)
        res.json(stock)
      })
      .catch(next)
  } else if (!req.body.portfolioId) {
    Portfolio.create({
      userId: null,
      status: 'open'
    })
      .then(portfolio =>
        Stock.create(req.body).then(stock => stock.setPortfolio(portfolio))
      )
      .then(stock => {
        req.session.portfolio.push(stock)
        res.json(stock)
      })
      .catch(next)
  }
})

router.put('/', (req, res, next) => {
  req.session.portfolio = req.session.portfolio.filter(
    sessionStock => sessionStock.id !== req.body.id
  )
  Stock.destroy({ where: { id: req.body.id } })
    .then(deletedRows => {
      deletedRows ? res.status(200).send('Stock removed') : res.sendStatus(204)
    })
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  req.portfolio.update(req.body).then(port => res.json(port))
})