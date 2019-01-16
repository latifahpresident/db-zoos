const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const kenexConfig = require('./knexfile.js');

const server = express();

server.use(express.json());
server.use(helmet());

const db = knex(kenexConfig.development);

// endpoints here
const url = '/api/zoos'

server.get(url, async(req, res) => {
    // db('zoos')
    // .then(zoos => {
    //     res.status(200).json(zoos)
    // })
    // .catch(err => res.status(500).json(err))
    try{
        const results = await db('zoos')
        res.status(200).json(results)
    }catch(err){
        res.status(500).json(`{error: 'That route could no  be found'}`)
    }
});

server.get(`${url}/:id`, async(req, res) => {
    const { id } = req.params;
    try{
        const results = await db(id)
        if(results === 0) {
            res.status(404).json(`{error: 'That ID was not found'}`)
        } else {
            res.status(200).json(results)
        }
    }catch(err){
        res.status(500).json(`{error: 'User information could not be found'}`)
    }
});

server.post(url, async(req, res) => {
    const { name } = req.body;
    try{
        if (!name) {
            res.status(404).json(`{error: 'Please enter name'}`)
        } else {
            const results = await db('zoos').insert(req.body)
            res.status(201).json(results)
        }
    }catch(err){
        res.status(500).json(`{error: 'data not created'}`)
    }
});

server.put(`${url}/:id`, async(req, res) => {
    const data = req.body;
    const { name } = req.body
    try{
        const results = await db('zoos').where({ id: req.params.id}).update(data)
        if(!name){
            res.status(404).json(`{error: 'Please enter zoo's name}`)
        } else {
            res.status(200).json(results)
        }
    }catch(err){
        res.status(500).json(err)
    }
});

server.delete('/api/zoos/:id', async(req, res) => {

    const { id } = req.params;
    db(id)
    try{
        const data = await db('zoos')
            .where({ id: req.params.id }).del()
            if(data) {
                res.status(204).json(data)
            } else {
                res.status(404).json(`{error: 'That ID was  not found'}`)
            }
    }catch(err){
        res.status(500).json(err)
    }
    // db('zoos')
    //   .where({ id: req.params.id })
    //   .del()
    //   .then(count => {
    //     res.status(200).json(count);
    //   })
    //   .catch(err => res.status(500).json(err));
  });

 

module.exports = server