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


module.exports = server